/**
 * Minimal read-only ZIP reader for EPUB containers.
 *
 * EPUB is a ZIP archive. The Host only needs to list entries and inflate the
 * entries named by the OPF spine, so this reader uses the central directory as
 * the authoritative index and inflates entry payloads on demand. It deliberately
 * rejects encrypted and ZIP64 archives instead of guessing.
 */
import { inflateRawSync } from 'node:zlib'

const EOCD_SIGNATURE = 0x06054b50
const CENTRAL_SIGNATURE = 0x02014b50
const LOCAL_SIGNATURE = 0x04034b50
const MAX_COMMENT = 0xffff
const MAX_ENTRY_BYTES = 64 * 1024 * 1024

export class ZipError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ZipError'
    this.code = 'INVALID_EPUB'
  }
}

function findEndOfCentralDirectory(buffer) {
  const start = Math.max(0, buffer.length - MAX_COMMENT - 22)
  for (let offset = buffer.length - 22; offset >= start; offset -= 1) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) return offset
  }
  throw new ZipError('不是有效的 EPUB：找不到 ZIP 中央目录')
}

/**
 * Read-only ZIP index over one EPUB file.
 */
export class ZipArchive {
  /** @param {Buffer} buffer complete EPUB bytes */
  constructor(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length < 22) {
      throw new ZipError('不是有效的 EPUB：文件为空或过短')
    }
    this.buffer = buffer
    /** @type {Map<string, {method:number, flags:number, compressed:Buffer, size:number}>} */
    this.entries = new Map()
    this.#readCentralDirectory()
  }

  #readCentralDirectory() {
    const eocd = findEndOfCentralDirectory(this.buffer)
    const disk = this.buffer.readUInt16LE(eocd + 4)
    const directoryDisk = this.buffer.readUInt16LE(eocd + 6)
    const count = this.buffer.readUInt16LE(eocd + 10)
    const directorySize = this.buffer.readUInt32LE(eocd + 12)
    const directoryOffset = this.buffer.readUInt32LE(eocd + 16)
    if (disk !== 0 || directoryDisk !== 0) throw new ZipError('不支持分卷 EPUB 压缩包')
    if (count === 0xffff || directorySize === 0xffffffff || directoryOffset === 0xffffffff) {
      throw new ZipError('暂不支持 ZIP64 格式的 EPUB')
    }
    if (directoryOffset + directorySize > this.buffer.length) {
      throw new ZipError('EPUB 的 ZIP 中央目录越界')
    }
    let offset = directoryOffset
    for (let index = 0; index < count; index += 1) {
      if (offset + 46 > this.buffer.length) throw new ZipError('EPUB 的 ZIP 目录项被截断')
      if (this.buffer.readUInt32LE(offset) !== CENTRAL_SIGNATURE) {
        throw new ZipError('EPUB 的 ZIP 目录项签名无效')
      }
      const flags = this.buffer.readUInt16LE(offset + 8)
      const method = this.buffer.readUInt16LE(offset + 10)
      const compressedSize = this.buffer.readUInt32LE(offset + 20)
      const size = this.buffer.readUInt32LE(offset + 24)
      const nameLength = this.buffer.readUInt16LE(offset + 28)
      const extraLength = this.buffer.readUInt16LE(offset + 30)
      const commentLength = this.buffer.readUInt16LE(offset + 32)
      const localOffset = this.buffer.readUInt32LE(offset + 42)
      const nameStart = offset + 46
      const nameEnd = nameStart + nameLength
      if (nameEnd > this.buffer.length) throw new ZipError('EPUB 的 ZIP 文件名越界')
      const name = this.buffer
        .toString('utf8', nameStart, nameEnd)
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
      offset = nameEnd + extraLength + commentLength

      if ((flags & 0x0001) !== 0) throw new ZipError('不支持加密的 EPUB 压缩包')
      if (size > MAX_ENTRY_BYTES) continue
      if (name === '' || name.endsWith('/')) continue
      if (localOffset + 30 > this.buffer.length) throw new ZipError('EPUB 的 ZIP 本地头越界')
      if (this.buffer.readUInt32LE(localOffset) !== LOCAL_SIGNATURE) {
        throw new ZipError('EPUB 的 ZIP 本地头签名无效')
      }
      const localNameLength = this.buffer.readUInt16LE(localOffset + 26)
      const localExtraLength = this.buffer.readUInt16LE(localOffset + 28)
      const dataStart = localOffset + 30 + localNameLength + localExtraLength
      const dataEnd = dataStart + compressedSize
      if (dataEnd > this.buffer.length) throw new ZipError('EPUB 的 ZIP 条目被截断')
      this.entries.set(name, {
        method,
        flags,
        compressed: this.buffer.subarray(dataStart, dataEnd),
        size,
      })
    }
  }

  /** @param {string} name normalized archive path */
  has(name) {
    return this.entries.has(name)
  }

  /** @param {string} name normalized archive path @returns {Buffer|undefined} */
  read(name) {
    const entry = this.entries.get(name)
    if (entry === undefined) return undefined
    if (entry.method === 0) return entry.compressed
    if (entry.method !== 8) throw new ZipError(`EPUB 使用了不支持的压缩方式 ${entry.method}`)
    try {
      const data = inflateRawSync(entry.compressed)
      if (entry.size !== 0 && data.length !== entry.size) {
        throw new ZipError(`EPUB 条目 "${name}" 解压后大小不符`)
      }
      return data
    } catch (error) {
      if (error instanceof ZipError) throw error
      throw new ZipError(`EPUB 条目 "${name}" 解压失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /** @param {string} name @returns {string|undefined} */
  readText(name) {
    const data = this.read(name)
    return data === undefined ? undefined : data.toString('utf8')
  }

  /** @returns {string[]} */
  list() {
    return [...this.entries.keys()]
  }
}
