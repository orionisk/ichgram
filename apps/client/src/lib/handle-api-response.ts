import { ZodError } from 'zod'
import formatApiError from './format-api-error'

export async function handleResponse(response: Response) {
  try {
    const error = await response.json()

    if (error instanceof ZodError) {
      throw new TypeError(error.errors.map(err => `${err.path}: ${err.message}`).join('\n'))
    }

    if (error.message) {
      throw new Error(error.message)
    }

    if ('success' in error) {
      throw new Error(formatApiError(error))
    }

    throw new Error('Something went wrong')
  }
  catch (err) {
    if (err instanceof Error)
      throw err
    throw new Error('Failed to parse error response')
  }
}
