/**
 * EPUB container parsing.
 *
 * This is deliberately a text-book reader rather than a full rendering engine:
 * it resolves the OPF spine, reads every XHTML chapter, promotes the TOC label
 * or first heading to a chapter title, and sends the body through the
 * allow-list sanitizer. Byte resources (images) stay in the ZIP and are served
 * on demand by the plugin's asset route.
 */
import { ZipArchive, ZipError } from './zip.js'
import {
  chapterHeading,
  resolveArchivePath,
  sanitizeChapter,
  stripTags,
} from './sanitize.js'

export class EpubError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EpubError'
    this.code = 'INVALID_EPUB'
  }
}

function decodeXmlText(value) {
  return stripTags(value)
}

function attributesOf(source) {
  const attributes = {}
  const pattern = /([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
  let match
  while ((match = pattern.exec(source)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return attributes
}

function firstDc(metadata, name) {
  const pattern = new RegExp(`<(?:dc:)?${name}\\b[^>]*>([\\s\\S]*?)</(?:dc:)?${name}>`, 'i')
  const match = metadata.match(pattern)
  return match === null ? '' : decodeXmlText(match[1])
}

function allDc(metadata, name) {
  const pattern = new RegExp(`<(?:dc:)?${name}\\b[^>]*>([\\s\\S]*?)</(?:dc:)?${name}>`, 'gi')
  const values = []
  let match
  while ((match = pattern.exec(metadata)) !== null) {
    const value = decodeXmlText(match[1])
    if (value !== '' && !values.includes(value)) values.push(value)
  }
  return values
}

function decodePath(value) {
  const raw = String(value ?? '').trim().replace(/^\/+/, '')
  if (raw === '') return ''
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function parseContainer(containerXml) {
  const rootfile = containerXml.match(/<(?:\w+:)?rootfile\b([^>]*?)\/?>/i)
  if (rootfile === null) throw new EpubError('EPUB 缺少 container.xml 的 rootfile')
  const attributes = attributesOf(rootfile[1])
  const path = decodePath(attributes['full-path'])
  if (path === '') throw new EpubError('EPUB 的 container.xml 没有有效的 full-path')
  return path
}

function parseManifest(opfXml, opfPath) {
  const manifestBlock = opfXml.match(/<(?:\w+:)?manifest\b[^>]*>([\s\S]*?)<\/(?:\w+:)?manifest>/i)
  const block = manifestBlock === null ? '' : manifestBlock[1]
  const items = []
  const byId = new Map()
  const pattern = /<(?:\w+:)?item\b([^>]*?)\/?>/gi
  let match
  while ((match = pattern.exec(block)) !== null) {
    const attributes = attributesOf(match[1])
    const id = (attributes.id ?? '').trim()
    const href = attributes.href ?? ''
    if (id === '' || href === '') continue
    const path = resolveArchivePath(opfPath, href)
    if (path === undefined) continue
    const item = {
      id,
      href,
      path,
      mediaType: (attributes['media-type'] ?? '').toLowerCase(),
      properties: (attributes.properties ?? '').toLowerCase(),
    }
    items.push(item)
    byId.set(id, item)
  }
  return { items, byId }
}

function parseSpine(opfXml, manifest) {
  const spineBlock = opfXml.match(/<(?:\w+:)?spine\b[^>]*>([\s\S]*?)<\/(?:\w+:)?spine>/i)
  const block = spineBlock === null ? '' : spineBlock[1]
  const idrefs = []
  const pattern = /<(?:\w+:)?itemref\b([^>]*?)\/?>/gi
  let match
  while ((match = pattern.exec(block)) !== null) {
    const attributes = attributesOf(match[1])
    if ((attributes.linear ?? '').toLowerCase() === 'no') continue
    const idref = (attributes.idref ?? '').trim()
    if (idref !== '' && manifest.byId.has(idref)) idrefs.push(idref)
  }
  if (idrefs.length > 0) return idrefs
  return manifest.items
    .filter((item) => item.mediaType.includes('html') && !item.properties.includes('nav'))
    .map((item) => item.id)
}

function parseNavDocument(zip, navPath) {
  const labels = new Map()
  const document = zip.readText(navPath)
  if (document === undefined) return labels
  let nav = document.match(/<(?:\w+:)?nav\b[^>]*epub:type\s*=\s*["'][^"']*\btoc\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:\w+:)?nav>/i)
  if (nav === null) nav = document.match(/<(?:\w+:)?nav\b[^>]*>([\s\S]*?)<\/(?:\w+:)?nav>/i)
  if (nav === null) return labels
  const anchors = nav[1].matchAll(/<(?:\w+:)?a\b([^>]*?)>([\s\S]*?)<\/(?:\w+:)?a>/gi)
  for (const anchor of anchors) {
    const attributes = attributesOf(anchor[1])
    const label = decodeXmlText(anchor[2])
    const path = resolveArchivePath(navPath, attributes.href ?? '')
    if (path !== undefined && label !== '' && !labels.has(path)) labels.set(path, label)
  }
  return labels
}

function parseNcxDocument(zip, ncxPath) {
  const labels = new Map()
  const document = zip.readText(ncxPath)
  if (document === undefined) return labels
  const pattern = /<(?:\w+:)?navLabel\b[^>]*>[\s\S]*?<(?:\w+:)?text\b[^>]*>([\s\S]*?)<\/(?:\w+:)?text>[\s\S]*?<\/(?:\w+:)?navLabel>\s*<(?:\w+:)?content\b([^>]*?)\/?>/gi
  let match
  while ((match = pattern.exec(document)) !== null) {
    const label = decodeXmlText(match[1])
    const attributes = attributesOf(match[2])
    const path = resolveArchivePath(ncxPath, attributes.src ?? '')
    if (path !== undefined && label !== '' && !labels.has(path)) labels.set(path, label)
  }
  return labels
}

function parseToc(zip, manifest) {
  const labels = new Map()
  const navItem = manifest.items.find((item) => item.properties.split(/\s+/).includes('nav'))
  if (navItem !== undefined) {
    for (const [path, label] of parseNavDocument(zip, navItem.path)) {
      if (!labels.has(path)) labels.set(path, label)
    }
  }
  const ncxItem = manifest.items.find((item) => item.mediaType === 'application/x-dtbncx+xml')
  if (ncxItem !== undefined) {
    for (const [path, label] of parseNcxDocument(zip, ncxItem.path)) {
      if (!labels.has(path)) labels.set(path, label)
    }
  }
  return labels
}

function parseMetadata(opfXml) {
  const block = opfXml.match(/<(?:\w+:)?metadata\b[^>]*>([\s\S]*?)<\/(?:\w+:)?metadata>/i)
  const metadata = block === null ? opfXml : block[1]
  const creators = allDc(metadata, 'creator').slice(0, 4)
  const title = firstDc(metadata, 'title')
  const language = firstDc(metadata, 'language')
  const publisher = firstDc(metadata, 'publisher')
  const description = firstDc(metadata, 'description')
  let coverId = ''
  const metas = metadata.matchAll(/<(?:\w+:)?meta\b([^>]*?)\/?>/gi)
  for (const meta of metas) {
    const attributes = attributesOf(meta[1])
    if ((attributes.name ?? '').toLowerCase() === 'cover') {
      coverId = attributes.content ?? ''
      break
    }
  }
  return {
    title,
    author: creators.join(' / '),
    language,
    publisher,
    description,
    coverId,
  }
}

function findCoverPath(manifest, coverId) {
  if (coverId !== '') {
    const item = manifest.byId.get(coverId)
    if (item !== undefined && item.mediaType.startsWith('image/')) return item.path
  }
  const item = manifest.items.find((entry) => entry.properties.split(/\s+/).includes('cover-image'))
  return item === undefined ? '' : item.path
}

function chapterFallbackTitle(path) {
  const name = path.split('/').pop() ?? path
  return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
}

/**
 * Parse one complete EPUB buffer into the reader's public book shape plus the
 * private ZIP handle used by the asset route.
 * @param {Buffer} buffer complete EPUB bytes
 * @param {object} options
 * @param {string} options.id public book id
 * @param {string} [options.fileName] fallback title source
 * @param {(bookId:string, path:string) => string} options.assetUrl
 * @returns {object}
 */
export function parseEpub(buffer, options) {
  let zip
  try {
    zip = new ZipArchive(buffer)
  } catch (error) {
    if (error instanceof ZipError || error instanceof EpubError) throw new EpubError(error.message)
    throw new EpubError(`无法打开 EPUB：${error instanceof Error ? error.message : String(error)}`)
  }

  const containerXml = zip.readText('META-INF/container.xml')
  if (containerXml === undefined) throw new EpubError('EPUB 缺少 META-INF/container.xml')
  const opfPath = parseContainer(containerXml)
  const opfXml = zip.readText(opfPath)
  if (opfXml === undefined) throw new EpubError(`EPUB 缺少 OPF 文件：${opfPath}`)

  const manifest = parseManifest(opfXml, opfPath)
  if (manifest.items.length === 0) throw new EpubError('EPUB 的 OPF 清单为空')
  const spine = parseSpine(opfXml, manifest)
  const toc = parseToc(zip, manifest)
  const metadata = parseMetadata(opfXml)
  const fallbackTitle = typeof options.fileName === 'string'
    ? options.fileName.replace(/\.epub$/i, '').replace(/[_-]+/g, ' ').trim()
    : ''

  const chapters = []
  for (const idref of spine) {
    const item = manifest.byId.get(idref)
    if (item === undefined) continue
    if (!item.mediaType.includes('html')) continue
    if (item.properties.split(/\s+/).includes('nav')) continue
    const raw = zip.readText(item.path)
    if (raw === undefined) continue
    const html = sanitizeChapter(raw, {
      bookId: options.id,
      chapterPath: item.path,
      hasAsset: (path) => zip.has(path),
      assetUrl: options.assetUrl,
    })
    if (html.replace(/<[^>]*>/g, '').trim() === '' && !html.includes('<img')) continue
    const title = toc.get(item.path) ?? chapterHeading(raw) ?? chapterFallbackTitle(item.path)
    chapters.push({ title, path: item.path, html })
    if (chapters.length >= 2000) break
  }

  if (chapters.length === 0) throw new EpubError('这本书没有可阅读的正文章节')

  const coverPath = findCoverPath(manifest, metadata.coverId)
  return {
    id: options.id,
    title: metadata.title !== '' ? metadata.title : fallbackTitle !== '' ? fallbackTitle : '未命名书籍',
    author: metadata.author,
    language: metadata.language,
    publisher: metadata.publisher,
    description: metadata.description,
    chapters,
    cover: coverPath === '' ? '' : options.assetUrl(options.id, coverPath),
    sourcePath: opfPath,
    zip,
  }
}
