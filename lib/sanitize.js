/**
 * EPUB XHTML to safe reader HTML.
 *
 * Book HTML is untrusted input: it is parsed by a small allow-list tokenizer
 * that keeps reading structure (headings, paragraphs, lists, emphasis, tables,
 * images) and drops scripts, styles, embedded documents, event handlers, inline
 * styles, and every outbound link. Images are rewritten to this plugin's
 * authenticated-in-spirit asset route, and internal links keep their resolved
 * target so the Client can move between chapters and anchors.
 */

const ALLOWED_TAGS = new Set([
  'p', 'div', 'section', 'article', 'header', 'footer', 'aside', 'main',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption',
  'hr', 'br', 'wbr',
  'em', 'strong', 'b', 'i', 'u', 's', 'strike', 'del', 'ins', 'small', 'big',
  'sub', 'sup', 'code', 'kbd', 'samp', 'var', 'mark', 'span', 'abbr', 'cite',
  'q', 'time', 'ruby', 'rt', 'rp',
])

const VOID_TAGS = new Set(['br', 'hr', 'wbr'])
const DROP_WITH_CONTENT = [
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form',
  'video', 'audio', 'canvas', 'noscript', 'template', 'map', 'area',
  'input', 'button', 'select', 'option', 'textarea', 'link', 'meta', 'base',
  'head', 'title',
]
const SAFE_CLASS = /^[A-Za-z0-9_:-]{1,48}$/
const SAFE_ID = /^[A-Za-z0-9_.:-]{1,96}$/

function escapeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;')
}

function parseAttributes(source) {
  const attributes = {}
  const pattern = /([A-Za-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
  let match
  while ((match = pattern.exec(source)) !== null) {
    const name = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ''
    attributes[name] = value
  }
  return attributes
}

function decodeEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = Number.parseInt(hex, 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : ''
    })
    .replace(/&#(\d+);/g, (_, decimal) => {
      const code = Number.parseInt(decimal, 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : ''
    })
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
}

export function stripTags(value) {
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Resolve a relative archive reference against a ZIP member path.
 * @param {string} basePath ZIP path of the document holding the reference
 * @param {string} reference raw href/src
 * @returns {string|undefined} normalized archive path, with no fragment
 */
export function resolveArchivePath(basePath, reference) {
  if (typeof reference !== 'string') return undefined
  const raw = reference.trim()
  if (raw === '' || raw.startsWith('#') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) || raw.startsWith('//')) {
    return undefined
  }
  let decoded
  try {
    decoded = decodeURIComponent(raw.split('#')[0].split('?')[0])
  } catch {
    return undefined
  }
  if (decoded === '') return undefined
  const parts = decoded.startsWith('/')
    ? []
    : basePath.split('/').slice(0, -1)
  for (const segment of decoded.replace(/^\/+/, '').split('/')) {
    if (segment === '' || segment === '.') continue
    if (segment === '..') {
      if (parts.length === 0) return undefined
      parts.pop()
      continue
    }
    if (segment.includes('\u0000')) return undefined
    parts.push(segment)
  }
  return parts.length === 0 ? undefined : parts.join('/')
}

function resolveInternalTarget(basePath, href) {
  if (typeof href !== 'string') return undefined
  const raw = href.trim()
  if (raw === '' || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) || raw.startsWith('//')) return undefined
  const hashIndex = raw.indexOf('#')
  const fragment = hashIndex === -1 ? '' : raw.slice(hashIndex + 1)
  const withoutFragment = hashIndex === -1 ? raw : raw.slice(0, hashIndex)
  if (withoutFragment === '') return fragment === '' ? undefined : `#${fragment}`
  const target = resolveArchivePath(basePath, withoutFragment)
  if (target === undefined) return undefined
  return fragment === '' ? target : `${target}#${fragment}`
}

function cleanClass(value) {
  if (typeof value !== 'string') return ''
  const classes = value
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter((entry) => SAFE_CLASS.test(entry))
    .slice(0, 4)
  return classes.join(' ')
}

function cleanId(value) {
  return typeof value === 'string' && SAFE_ID.test(value.trim()) ? value.trim() : ''
}

function safeDimension(value) {
  const number = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(number) && number > 0 && number <= 1000 ? String(number) : ''
}

/**
 * Remove blocks whose content must never reach the browser.
 * @param {string} html XHTML source
 */
export function stripUnsafeBlocks(html) {
  let output = String(html)
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
  for (const tag of DROP_WITH_CONTENT) {
    output = output
      .replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
      .replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi'), '')
  }
  return output
}

/**
 * Turn one EPUB spine document into safe reader HTML.
 * @param {string} raw XHTML source
 * @param {object} options
 * @param {string} options.bookId public book id
 * @param {string} options.chapterPath ZIP path of this chapter
 * @param {(path:string) => boolean} [options.hasAsset] whether an archive member exists
 * @param {(bookId:string, path:string) => string} options.assetUrl
 * @returns {string} sanitized HTML
 */
export function sanitizeChapter(raw, options) {
  let html = stripUnsafeBlocks(raw)
  const body = html.match(/<(?:\w+:)?body\b[^>]*>([\s\S]*?)<\/(?:\w+:)?body>/i)
  if (body !== null) html = body[1]

  let output = ''
  let lastIndex = 0
  const tagPattern = /<(\/?)([A-Za-z][\w:.-]*)([^>]*)>/g
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    output += html.slice(lastIndex, match.index)
    lastIndex = tagPattern.lastIndex
    const closing = match[1] === '/'
    const tag = match[2].toLowerCase()
    const rawAttributes = match[3] ?? ''

    if (tag === 'a') {
      if (closing) {
        output += '</a>'
        continue
      }
      const attributes = parseAttributes(rawAttributes)
      const id = cleanId(attributes.id)
      const target = resolveInternalTarget(options.chapterPath, attributes.href)
      output += '<a class="epub-link"'
      if (id !== '') output += ` id="${escapeAttribute(id)}"`
      if (target !== undefined) output += ` data-epub-href="${escapeAttribute(target)}"`
      output += '>'
      continue
    }

    if (tag === 'img') {
      if (closing) continue
      const attributes = parseAttributes(rawAttributes)
      const alt = attributes.alt ?? ''
      const path = resolveArchivePath(options.chapterPath, attributes.src)
      if (path === undefined || (options.hasAsset !== undefined && !options.hasAsset(path))) {
        if (alt.trim() !== '') output += `<span class="epub-image-alt">${escapeText(alt)}</span>`
        continue
      }
      output += `<img src="${escapeAttribute(options.assetUrl(options.bookId, path))}"`
      output += ` alt="${escapeAttribute(alt)}" loading="lazy" decoding="async">`
      continue
    }

    if (!ALLOWED_TAGS.has(tag)) continue

    if (closing) {
      if (!VOID_TAGS.has(tag)) output += `</${tag}>`
      continue
    }

    const attributes = parseAttributes(rawAttributes)
    output += `<${tag}`
    const id = cleanId(attributes.id)
    const className = cleanClass(attributes.class)
    if (id !== '') output += ` id="${escapeAttribute(id)}"`
    if (className !== '') output += ` class="${escapeAttribute(className)}"`
    if (tag === 'td' || tag === 'th') {
      const colspan = safeDimension(attributes.colspan)
      const rowspan = safeDimension(attributes.rowspan)
      if (colspan !== '') output += ` colspan="${colspan}"`
      if (rowspan !== '') output += ` rowspan="${rowspan}"`
    }
    if (tag === 'time' && typeof attributes.datetime === 'string' && attributes.datetime.length <= 64) {
      output += ` datetime="${escapeAttribute(attributes.datetime)}"`
    }
    output += '>'
  }
  output += html.slice(lastIndex)

  return output
    .replace(/<p[^>]*>\s*(?:&nbsp;|\s)*<\/p>/gi, '')
    .replace(/(?:\r?\n){3,}/g, '\n\n')
    .trim()
}

/**
 * Extract a human title from a chapter document.
 * @param {string} raw XHTML source
 * @returns {string}
 */
export function chapterHeading(raw) {
  const title = String(raw).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  if (title !== null) {
    const text = stripTags(title[1]).replace(/^The Project Gutenberg eBook of\s+/i, '').trim()
    if (text !== '' && !/^Project Gutenberg$/i.test(text)) return text.slice(0, 140)
  }
  const bodyMatch = String(raw).match(/<(?:\w+:)?body\b[^>]*>([\s\S]*?)<\/(?:\w+:)?body>/i)
  const body = bodyMatch === null ? String(raw) : bodyMatch[1]
  const heading = body.match(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/i)
  if (heading !== null) {
    const text = stripTags(heading[2])
    if (text !== '') return text.slice(0, 140)
  }
  return ''
}
