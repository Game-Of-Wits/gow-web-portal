import { ErrorCode } from './ErrorCode'

export class ErrorResponse extends Error {
  code: ErrorCode | string

  constructor(code: string)
  constructor(code: string, message: string)

  constructor(code: ErrorCode | string, message?: string) {
    super(message ?? '')
    this.code = code

    Object.setPrototypeOf(this, ErrorResponse.prototype)
  }
}
