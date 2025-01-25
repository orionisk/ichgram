import type { StatusCode } from 'hono/utils/http-status'
import * as C from 'stoker/http-status-codes'
import * as P from 'stoker/http-status-phrases'

interface ErrorDetails {
  message: string
  details?: unknown
}

export class AppError<T extends StatusCode> extends Error {
  readonly timestamp: string
  readonly path?: string

  constructor(public readonly statusCode: T, message: string, public readonly details?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.timestamp = new Date().toISOString()
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(): ErrorDetails {
    return {
      message: this.message,
      details: this.details ?? undefined,
    } as ErrorDetails
  }
}

function defineError<T extends StatusCode>(statusCode: T, defaultMessage?: string) {
  return class extends AppError<T> {
    constructor(message: string = defaultMessage ?? 'An error occurred', details?: unknown) {
      super(statusCode, message, details)
    }
  }
}

export const ValidationError = defineError(C.BAD_REQUEST, P.BAD_REQUEST)
export const AuthenticationError = defineError(C.UNAUTHORIZED, P.UNAUTHORIZED)
export const AuthorizationError = defineError(C.FORBIDDEN, P.FORBIDDEN)
export const NotFoundError = defineError(C.NOT_FOUND, P.NOT_FOUND)
export const ConflictError = defineError(C.CONFLICT, P.CONFLICT)
export const BadRequestError = defineError(C.BAD_REQUEST, P.BAD_REQUEST)
