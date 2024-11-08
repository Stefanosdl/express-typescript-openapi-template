abstract class AbstractHttpError extends Error {
  message: string
  params?: string

  constructor(message: string, params?: string) {
    super(message)
    Error.call(this) // super constructor
    Error.captureStackTrace(this, this.constructor)
    this.message = message
    this.params = params
    Object.setPrototypeOf(this, AbstractHttpError.prototype)
  }
}

export default AbstractHttpError
