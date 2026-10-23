/**
 * Format dispatch and text-first parsers for non-EPUB books.
 *
 * EPUB keeps its full spine/asset parser. The other formats are normalized into
 * the same `{ chapters: [{ title, path, html }] }` shape so the reader, progress,
 * annotations, and AI context work unchanged. PDF is parsed with the vendored
 * PDF.js runtime; DOCX reuses the ZIP reader; HTML/FB2/Markdown/TXT are converted
 * with the same allow-list sanitizer used for EPUB chapters.
 */
import path from 'node:path'
import { BookError } from './book-error.js'
import { EpubError, parseEpub } from './epub.js'
import { sanitizeChapter, stripTags } from './sanitize.js'
import { ZipArchive } from './zip.js'

export { BookError, EpubError }

const PAGE_CHUNK = 12_000

function fallbackTitle(fileName) {
  return typeof fileName === 'string'
    ? fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || '未命名书籍'
    : '未命名书籍'
}

function decodeText(buffer) {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.subarray(2).toString('utf16le')
  }
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    const swapped = Buffer.from(buffer.subarray(2))
    swapped.swap16()
    return swapped.toString('utf16le')
  }
  return buffer.toString('utf8').replace(/^\uFEFF/, '')
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function decodeXmlText(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

function markdownToHtml(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const output = []
  let paragraph = []
  let listType = ''
  let listItems = []
  let codeFence = false
  let codeLines = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    output.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`)
    paragraph = []
  }
  const flushList = () => {
    if (listItems.length === 0) return
    output.push(`<${listType}>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</${listType}>`)
    listItems = []
    listType = ''
  }
  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (const line of lines) {
    if (codeFence) {
      if (/^```/.test(line)) {
        output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
        codeLines = []
        codeFence = false
      } else {
        codeLines.push(line)
      }
      continue
    }
    if (/^```/.test(line)) {
      flushAll()
      codeFence = true
      continue
    }
    if (line.trim() === '') {
      flushAll()
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading !== null) {
      flushAll()
      const level = heading[1].length
      output.push(`<h${level}>${inlineMarkdown(heading[2].trim())}</h${level}>`)
      continue
    }
    if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)) {
      flushAll()
      output.push('<hr>')
      continue
    }
    const quote = line.match(/^\s*>\s?(.*)$/)
    if (quote !== null) {
      flushAll()
      output.push(`<blockquote><p>${inlineMarkdown(quote[1])}</p></blockquote>`)
      continue
    }
    const list = line.match(/^\s*(?:([-*+])|(\d+)\.)\s+(.*)$/)
    if (list !== null) {
      flushParagraph()
      const type = list[2] === undefined ? 'ul' : 'ol'
      if (listType !== '' && listType !== type) flushList()
      listType = type
      listItems.push(list[3])
      continue
    }
    if (listType !== '') flushList()
    paragraph.push(line.trim())
  }
  if (codeFence) output.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
  flushAll()
  return output.join('\n')
}

function splitMarkdownChapters(html, title) {
  const parts = html.split(/(?=<h[12][\s>])/i).filter((part) => part.trim() !== '')
  if (parts.length <= 1) return [{ title, path: 'md:1', html }]
  return parts.map((part, index) => {
    const heading = part.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i)
    const chapterTitle = heading === null ? (index === 0 ? title : `第 ${index + 1} 节`) : stripTags(heading[1])
    return { title: chapterTitle || `第 ${index + 1} 节`, path: `md:${index + 1}`, html: part }
  })
}

function parseTxt(buffer, options) {
  const text = decodeText(buffer).replace(/\r\n?/g, '\n').trim()
  if (text === '') throw new BookError('EMPTY_BOOK', '文本文件是空的')
  let blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter((block) => block !== '')
  if (blocks.length <= 1) {
    blocks = text.split(/\n/).map((line) => line.trim()).filter((line) => line !== '')
  }
  const chapters = []
  let current = []
  let size = 0
  const flush = () => {
    if (current.length === 0) return
    const first = current[0].split('\n')[0].replace(/\s+/g, ' ').trim()
    chapters.push({
      title: first.length > 0 ? first.slice(0, 100) : `第 ${chapters.length + 1} 节`,
      path: `txt:${chapters.length + 1}`,
      html: current.map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`).join('\n'),
    })
    current = []
    size = 0
  }
  for (const block of blocks) {
    if (size > 0 && size + block.length > PAGE_CHUNK) flush()
    current.push(block)
    size += block.length + 2
  }
  flush()
  return {
    id: options.id,
    title: fallbackTitle(options.fileName),
    author: '',
    language: '',
    publisher: '',
    description: '',
    chapters,
    cover: '',
    format: 'TXT',
    zip: null,
  }
}

function parseMarkdown(buffer, options) {
  const text = decodeText(buffer).replace(/\r\n?/g, '\n')
  if (text.trim() === '') throw new BookError('EMPTY_BOOK', 'Markdown 文件是空的')
  const title = fallbackTitle(options.fileName)
  const html = markdownToHtml(text)
  return {
    id: options.id,
    title,
    author: '',
    language: '',
    publisher: '',
    description: '',
    chapters: splitMarkdownChapters(html, title),
    cover: '',
    format: 'MARKDOWN',
    zip: null,
  }
}

function parseHtmlBook(buffer, options) {
  const raw = decodeText(buffer)
  if (raw.trim() === '') throw new BookError('EMPTY_BOOK', 'HTML 文件是空的')
  const titleMatch = raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  const headingMatch = raw.match(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/i)
  const title = titleMatch !== null
    ? stripTags(titleMatch[1])
    : headingMatch !== null
      ? stripTags(headingMatch[2])
      : fallbackTitle(options.fileName)
  const html = sanitizeChapter(raw, {
    bookId: options.id,
    chapterPath: 'book.html',
    hasAsset: () => false,
    assetUrl: () => '',
  })
  if (html.trim() === '') throw new BookError('EMPTY_BOOK', 'HTML 中没有可阅读的正文')
  return {
    id: options.id,
    title: title || fallbackTitle(options.fileName),
    author: '',
    language: '',
    publisher: '',
    description: '',
    chapters: [{ title: title || fallbackTitle(options.fileName), path: 'html:1', html }],
    cover: '',
    format: 'HTML',
    zip: null,
  }
}

function parseFb2(buffer, options) {
  const raw = decodeText(buffer)
  const bodyMatch = raw.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch === null) throw new BookError('INVALID_FB2', 'FB2 缺少 body 正文')
  let body = bodyMatch[1]
    .replace(/<binary\b[^>]*>[\s\S]*?<\/binary>/gi, '')
    .replace(/<title\b[^>]*>([\s\S]*?)<\/title>/gi, (_, inner) => `<h2>${stripTags(inner)}</h2>`)
    .replace(/<subtitle\b[^>]*>([\s\S]*?)<\/subtitle>/gi, (_, inner) => `<h3>${stripTags(inner)}</h3>`)
    .replace(/<epigraph\b[^>]*>([\s\S]*?)<\/epigraph>/gi, (_, inner) => `<blockquote>${inner}</blockquote>`)
    .replace(/<poem\b[^>]*>([\s\S]*?)<\/poem>/gi, (_, inner) => `<div>${inner}</div>`)
    .replace(/<stanza\b[^>]*>([\s\S]*?)<\/stanza>/gi, (_, inner) => `<p>${inner}</p>`)
    .replace(/<v\b[^>]*>([\s\S]*?)<\/v>/gi, (_, inner) => `<p>${inner}</p>`)
    .replace(/<empty-line\b[^>]*\/>/gi, '<br>')
  const html = sanitizeChapter(body, {
    bookId: options.id,
    chapterPath: 'book.fb2',
    hasAsset: () => false,
    assetUrl: () => '',
  })
  if (html.trim() === '') throw new BookError('EMPTY_BOOK', 'FB2 中没有可阅读的正文')
  const titleMatch = raw.match(/<book-title\b[^>]*>([\s\S]*?)<\/book-title>/i)
  const firstName = raw.match(/<first-name\b[^>]*>([\s\S]*?)<\/first-name>/i)
  const lastName = raw.match(/<last-name\b[^>]*>([\s\S]*?)<\/last-name>/i)
  const language = raw.match(/<lang\b[^>]*>([\s\S]*?)<\/lang>/i)
  const title = titleMatch === null ? fallbackTitle(options.fileName) : stripTags(titleMatch[1])
  const author = [firstName, lastName]
    .filter((match) => match !== null)
    .map((match) => stripTags(match[1]))
    .filter(Boolean)
    .join(' ')
  return {
    id: options.id,
    title: title || fallbackTitle(options.fileName),
    author,
    language: language === null ? '' : stripTags(language[1]),
    publisher: '',
    description: '',
    chapters: [{ title: title || fallbackTitle(options.fileName), path: 'fb2:1', html }],
    cover: '',
    format: 'FB2',
    zip: null,
  }
}

function extractWordText(paragraphXml) {
  let result = ''
  const pattern = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>/g
  let match
  while ((match = pattern.exec(paragraphXml)) !== null) {
    if (match[1] !== undefined) result += decodeXmlText(match[1])
    else if (match[0].startsWith('<w:tab')) result += '\t'
    else result += '\n'
  }
  return result.replace(/\u00a0/g, ' ').trim()
}

function parseDocx(buffer, options) {
  let archive
  try {
    archive = new ZipArchive(buffer)
  } catch (error) {
    throw new BookError('INVALID_DOCX', `无法打开 DOCX：${error instanceof Error ? error.message : String(error)}`)
  }
  const documentXml = archive.readText('word/document.xml')
  if (documentXml === undefined) throw new BookError('INVALID_DOCX', 'DOCX 缺少 word/document.xml')
  const coreXml = archive.readText('docProps/core.xml') ?? ''
  const metaTitle = coreXml.match(/<(?:dc:)?title\b[^>]*>([\s\S]*?)<\/(?:dc:)?title>/i)
  const metaCreator = coreXml.match(/<(?:dc:)?creator\b[^>]*>([\s\S]*?)<\/(?:dc:)?creator>/i)
  const fallback = fallbackTitle(options.fileName)
  const title = metaTitle === null ? fallback : stripTags(metaTitle[1]) || fallback
  const author = metaCreator === null ? '' : stripTags(metaCreator[1])

  const paragraphs = []
  const pattern = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g
  let match
  while ((match = pattern.exec(documentXml)) !== null) {
    const inner = match[1]
    const text = extractWordText(inner)
    if (text === '') continue
    const styleMatch = inner.match(/<w:pStyle\b[^>]*w:val="([^"]+)"/i)
    paragraphs.push({ text, style: styleMatch === null ? '' : styleMatch[1] })
  }
  if (paragraphs.length === 0) throw new BookError('EMPTY_BOOK', 'DOCX 中没有可阅读的正文')

  const chapters = []
  let current = { title: '', parts: [] }
  const flush = () => {
    if (current.parts.length === 0) return
    chapters.push({
      title: current.title || `第 ${chapters.length + 1} 章`,
      path: `docx:${chapters.length + 1}`,
      html: current.parts.join('\n'),
    })
    current = { title: '', parts: [] }
  }
  for (const paragraph of paragraphs) {
    const isHeading = /Heading[1-3]|Title/i.test(paragraph.style)
    if (isHeading && current.parts.length > 0) flush()
    if (isHeading) {
      current.title = paragraph.text
      current.parts.push(`<h2>${escapeHtml(paragraph.text)}</h2>`)
    } else {
      current.parts.push(`<p>${escapeHtml(paragraph.text).replace(/\n/g, '<br>')}</p>`)
    }
  }
  flush()
  return {
    id: options.id,
    title,
    author,
    language: '',
    publisher: '',
    description: '',
    chapters,
    cover: '',
    format: 'DOCX',
    zip: null,
  }
}

/**
 * Parse any supported book file into the reader's normalized book shape.
 * @param {Buffer} buffer complete file bytes
 * @param {{id:string, fileName?:string, assetUrl:(bookId:string, path:string)=>string}} options
 */
export async function parseBook(buffer, options) {
  const extension = path.extname(options.fileName ?? '').toLowerCase()
  let book
  if (extension === '.epub') {
    book = parseEpub(buffer, options)
  } else if (extension === '.pdf') {
    const { parsePdf } = await import('./pdf.js')
    book = await parsePdf(buffer, options)
  } else if (extension === '.docx') {
    book = parseDocx(buffer, options)
  } else if (extension === '.fb2') {
    book = parseFb2(buffer, options)
  } else if (extension === '.html' || extension === '.htm' || extension === '.xhtml') {
    book = parseHtmlBook(buffer, options)
  } else if (extension === '.md' || extension === '.markdown') {
    book = parseMarkdown(buffer, options)
  } else if (extension === '.txt' || extension === '.text') {
    book = parseTxt(buffer, options)
  } else if (extension === '.mobi' || extension === '.azw3' || extension === '.azw') {
    throw new BookError('CONVERSION_REQUIRED', 'MOBI/AZW3 需要先用 Calibre 转换为 EPUB 或 PDF 再导入')
  } else {
    throw new BookError('UNSUPPORTED_FORMAT', `不支持的书籍格式：${extension || '未知'}。支持 EPUB、PDF、TXT、Markdown、HTML、FB2、DOCX`)
  }
  book.zip ??= null
  book.format ??= extension.slice(1).toUpperCase()
  if (!Array.isArray(book.chapters) || book.chapters.length === 0) {
    throw new BookError('EMPTY_BOOK', '这本书没有可阅读的正文')
  }
  return book
}
