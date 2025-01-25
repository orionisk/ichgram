import * as C from '@api/lib/constants'
import { createRoute, z } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json } from 'stoker/openapi/helpers'

export const createCommentLike = createRoute({
  method: 'post',
  path: '/:commentId',
  security: [{ bearerAuth: [] }],
  tags: ['Post Comments'],
  summary: 'Create a like on a post comment',
  description: 'Create a like on a post comment',
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'Like created'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'Comment not found'),
    [R.FORBIDDEN]: json(C.forbiddenSchema, 'Cannot like own comment'),
    [R.CONFLICT]: json(C.conflictSchema, 'Already liked'),
  },
})

export const deleteCommentLike = createRoute({
  method: 'delete',
  path: '/:commentId',
  security: [{ bearerAuth: [] }],
  tags: ['Post Comments'],
  summary: 'Delete a like on a post comment',
  description: 'Delete a like on a post comment',
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'Like removed'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'Like not found'),
  },
})

export type CreateCommentLikeRoute = typeof createCommentLike
export type DeleteCommentLikeRoute = typeof deleteCommentLike
