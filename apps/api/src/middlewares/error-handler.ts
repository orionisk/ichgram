import type { Context } from 'hono'
import {
  AppError,
} from '@api/types/error'
import * as R from 'stoker/http-status-codes'
import { onError } from 'stoker/middlewares'
import env from '../env'

export async function errorHandler(error: Error, c: Context) {
  const logger = c.get('logger')
  logger.error(error)

  if (error instanceof AppError) {
    return c.json(error.toJSON(), error.statusCode)
  }

  if (error.message.includes('JSON')) {
    return c.json(
      { message: 'Invalid JSON format' },
      R.BAD_REQUEST,
    )
  }

  if (env.NODE_ENV === 'production')
    return c.json({ message: 'Internal Server Error' }, R.INTERNAL_SERVER_ERROR)
  return onError(error, c)
}
