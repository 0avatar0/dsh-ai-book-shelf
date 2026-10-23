/**
 * PDF text extraction with the vendored PDF.js runtime.
 *
 * The reader is text-first: pages are converted to escaped paragraphs and
 * grouped into short chapters so a large PDF stays responsive. Scanned PDFs
 * without a text layer are rejected with an explicit error instead of showing
 * hundreds of blank pages.
 */
import { GlobalWorkerOptions, getDocument } from '../vendor/pdfjs/pdf.mjs'
import { BookError } from './book-error.js'

GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/pdf.worker.mjs', import.meta.url).href
const CMapUrl = new URL('../vendor/pdfjs/cmaps/', import.meta.url).href
const StandardFontDataUrl = new URL('../vendor/pdfjs/standard_fonts/', import.meta.url).href

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function needsSpace(previous, next) {
  if (previous === '' || next === '') return false
  const left = previous[previous.length - 1]
  const right = next[0]
  if (/\s/.test(left) || /^[\s.,;:!?)\]}]/.test(right)) return false
  return /[A-Za-z0-9]$/.test(left) && /^[A-Za-z0-9]/.test(right)
}

function itemsToText(items) {
  let output = ''
  let lastY = null
  for (const item of items) {
    const text = typeof item?.str === 'string' ? item.str : ''
    if (text === '') {
      if (item?.hasEOL) output += '\n'
      continue
    }
    const y = Array.isArray(item.transform) && Number.isFinite(item.transform[5]) ? item.transform[5] : null
    if (output !== '' && !output.endsWith('\n') && y !== null && lastY !== null && Math.abs(y - lastY) > 2.5) {
      output += '\n'
    } else if (needsSpace(output, text)) {
      output += ' '
    }
    output += text
    if (item.hasEOL) output += '\n'
    lastY = y
  }
  return output.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

function plainTitle(value, fallback) {
  const text = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
  return text !== '' ? text : fallback
}

/**
 * @param {Buffer} buffer complete PDF bytes
 * @param {{id:string, fileName?:string}} options
 */
export async function parsePdf(buffer, options) {
  const fallbackTitle = typeof options.fileName === 'string'
    ? options.fileName.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim()
    : '未命名 PDF'
  let document
  try {
    document = await getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,
      cMapUrl: CMapUrl,
      cMapPacked: true,
      standardFontDataUrl: StandardFontDataUrl,
      verbosity: 0,
    }).promise
  } catch (error) {
    throw new BookError('INVALID_PDF', `无法打开 PDF：${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    const pages = []
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const content = await page.getTextContent()
      const text = itemsToText(content.items)
      if (text !== '') pages.push({ pageNumber, text })
      page.cleanup()
    }
    if (pages.length === 0) {
      throw new BookError('PDF_NO_TEXT', '这个 PDF 没有可提取的文字，可能是扫描版或纯图片 PDF')
    }
    const metadata = await document.getMetadata().catch(() => ({ info: {} }))
    const info = metadata?.info ?? {}
    const chapters = []
    const pagesPerChapter = 8
    for (let start = 0; start < pages.length; start += pagesPerChapter) {
      const slice = pages.slice(start, start + pagesPerChapter)
      const first = slice[0].pageNumber
      const last = slice[slice.length - 1].pageNumber
      const title = first === last ? `第 ${first} 页` : `第 ${first}–${last} 页`
      const html = slice
        .map((page) => `<div class="pdf-page" data-page="${page.pageNumber}"><p>${escapeHtml(page.text).replace(/\n/g, '<br>')}</p></div>`)
        .join('\n')
      chapters.push({ title, path: `pdf:page-${first}`, html })
    }
    return {
      id: options.id,
      title: plainTitle(info.Title, fallbackTitle),
      author: plainTitle(info.Author, ''),
      language: plainTitle(info.Language, ''),
      publisher: '',
      description: '',
      chapters,
      paperPages: pages,
      cover: '',
      format: 'PDF',
      zip: null,
    }
  } finally {
    await document.destroy().catch(() => {})
  }
}
