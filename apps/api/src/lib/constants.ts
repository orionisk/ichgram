import * as P from 'stoker/http-status-phrases'
import { createMessageObjectSchema as cmos } from 'stoker/openapi/schemas'

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: 'Required',
  EXPECTED_NUMBER: 'Expected number, received nan',
  NO_UPDATES: 'No updates provided',
}

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
}

export const badRequestSchema = cmos(P.BAD_REQUEST)
export const notFoundSchema = cmos(P.NOT_FOUND)
export const unauthorizedSchema = cmos(P.UNAUTHORIZED)
export const forbiddenSchema = cmos(P.FORBIDDEN)
export const conflictSchema = cmos(P.CONFLICT)
