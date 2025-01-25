import * as C from '@api/lib/constants'
import { createRoute } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json } from 'stoker/openapi/helpers'
import * as s from './follow.schema'

export const createFollow = createRoute({
  method: 'post',
  path: '/:username',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Follow a user',
  summary: 'Follow a user',
  responses: {
    [R.OK]: json(s.followResSchema, 'Follow created'),
    [R.BAD_REQUEST]: json(C.badRequestSchema, 'Cannot follow yourself'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
    [R.CONFLICT]: json(C.conflictSchema, 'Already following'),
  },
})

export const deleteFollow = createRoute({
  method: 'delete',
  path: '/:username',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Unfollow a user',
  summary: 'Unfollow a user',
  responses: {
    [R.OK]: json(s.followResSchema, 'Follow removed'),
    [R.BAD_REQUEST]: json(C.badRequestSchema, 'Cannot unfollow yourself'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
    [R.CONFLICT]: json(C.conflictSchema, 'Already not following'),
  },
})

export type CreateFollowRoute = typeof createFollow
export type DeleteFollowRoute = typeof deleteFollow
