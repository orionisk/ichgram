import { notFoundSchema } from '@api/lib/constants'
import * as C from '@api/lib/constants'
import { createRoute } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as s from './user.schema'

export const getUsers = createRoute({
  method: 'get',
  path: '/search',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Search for users',
  summary: 'Search for users',
  request: {
    query: s.getUsersReqSchema,
  },
  responses: {
    [R.OK]: json(s.getUsersResSchema, 'List of users'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.getUsersReqSchema), 'Invalid query'),
  },
})

export const getCurrentUser = createRoute({
  method: 'get',
  path: '/me',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Get the current user',
  summary: 'Get the current user',
  responses: {
    [R.OK]: json(s.getCurrentUserResSchema, 'User profile'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
  },
})

export const updateProfile = createRoute({
  method: 'patch',
  path: '/me',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Update the current user',
  summary: 'Update the current user',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: s.updateProfileReqSchema,
        },
      },
    },
  },
  responses: {
    [R.OK]: json(s.updateProfileResSchema, 'Updated profile'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.CONFLICT]: json(C.conflictSchema, 'Username already taken'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.updateProfileReqSchema), 'Invalid request'),
  },
})

export const getUserProfile = createRoute({
  method: 'get',
  path: '/:username/profile',
  security: [{ bearerAuth: [] }],
  tags: ['Users'],
  description: 'Get a user profile',
  summary: 'Get a user profile',
  responses: {
    [R.OK]: json(s.getUserResSchema, 'User profile'),
    [R.NOT_FOUND]: json(notFoundSchema, 'User not found'),
  },
})

export type GetCurrentUserRoute = typeof getCurrentUser
export type UpdateProfileRoute = typeof updateProfile
export type GetUsersRoute = typeof getUsers
export type GetUserProfileRoute = typeof getUserProfile
