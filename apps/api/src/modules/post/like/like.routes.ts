import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

export const createLike = createRoute({
  method: 'post',
  path: '/:id',
  security: [{ bearerAuth: [] }],
  tags: ['Posts'],
  description: 'Create a like on a post',
  summary: 'Create a like on a post',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
      }),
      'Like created',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Post not found',
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      z.object({ message: z.string() }),
      'Already liked',
    ),
  },
})

export const deleteLike = createRoute({
  method: 'delete',
  path: '/:id',
  security: [{ bearerAuth: [] }],
  tags: ['Posts'],
  description: 'Delete a like on a post',
  summary: 'Delete a like on a post',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        success: z.boolean(),
      }),
      'Like removed',
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      'Like not found',
    ),
  },
})

export type CreateLikeRoute = typeof createLike
export type DeleteLikeRoute = typeof deleteLike
