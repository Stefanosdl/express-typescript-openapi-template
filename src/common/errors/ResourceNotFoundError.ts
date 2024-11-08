import AbstractHttpError from './AbstractHttpError'

export default class ResourceNotFoundError extends AbstractHttpError {
  errorCode: string

  constructor(errorCode, params?) {
    super(errorCode?.userMessage || errorCode?.userTitle)
    this.name = this.constructor.name
    this.errorCode = errorCode
    this.params = params
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype)
  }
}
