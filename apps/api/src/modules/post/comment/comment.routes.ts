import * as C from '@api/lib/constants'
import { paginationQuerySchema } from '@api/schemas/common'
import { createRoute } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json, jsonContentRequired as jsonReq } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as s from './comment.schema'

export const createComment = createRoute({
  method: 'post',
  path: '/:postId',
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonReq(s.createCommentReqSchema, 'Comment creation data'),
  },
  tags: ['Post Comments'],
  summary: 'Create a comment on a post',
  description: 'Create a comment on a post',
  responses: {
    [R.OK]: json(s.createCommentResSchema, 'Created comment'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'Post not found'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.createCommentReqSchema), 'Validation error'),
  },
})

export const getPostComments = createRoute({
  method: 'get',
  path: '/:postId',
  security: [{ bearerAuth: [] }],
  request: {
    query: paginationQuerySchema,
  },
  tags: ['Post Comments'],
  summary: 'Get post comments',
  description: 'Get post comments',
  responses: {
    [R.OK]: json(s.getPostCommentsResSchema, 'Post comments'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'Post not found'),
    [R.UNPROCESSABLE_ENTITY]: json(error(paginationQuerySchema), 'Validation error'),
  },
})

export type CreateCommentRoute = typeof createComment
export type GetPostCommentsRoute = typeof getPostComments
