export class BookError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'BookError'
    this.code = code
  }
}
