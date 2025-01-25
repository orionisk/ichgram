import * as C from '@api/lib/constants'
import { paginationQuerySchema } from '@api/schemas/common'
import { createRoute } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as s from './chat.schema'

export const getChatRooms = createRoute({
  method: 'get',
  path: '/rooms',
  security: [{ bearerAuth: [] }],
  query: paginationQuerySchema,
  tags: ['Chat'],
  summary: 'Get user chat rooms',
  description: 'Get user chat rooms',
  responses: {
    [R.OK]: json(s.getChatRoomsResSchema, 'List of chat rooms'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.UNPROCESSABLE_ENTITY]: json(error(paginationQuerySchema), 'The validation error(s)'),
  },
})

export const getChatHistory = createRoute({
  method: 'get',
  path: '/history/:userId',
  security: [{ bearerAuth: [] }],
  request: {
    query: paginationQuerySchema,
  },
  tags: ['Chat'],
  summary: 'Get chat history with user',
  description: 'Get chat history with user',
  responses: {
    [R.OK]: json(s.getChatHistoryResSchema, 'Chat history with user'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
    [R.UNPROCESSABLE_ENTITY]: json(error(paginationQuerySchema), 'The validation error(s)'),
  },
})

export const ws = createRoute({
  method: 'get',
  path: '/ws',
  tags: ['Chat'],
  query: s.wsQuerySchema,
  summary: 'WebSocket connection',
  description: 'WebSocket connection',
  responses: {
    [R.SWITCHING_PROTOCOLS]: {
      description: 'WebSocket connection established',
    },
  },
})

export const createChatRoom = createRoute({
  method: 'post',
  path: '/rooms',
  security: [{ bearerAuth: [] }],
  tags: ['Chat'],
  summary: 'Create chat room',
  description: 'Create chat room',
  request: {
    body: json(s.createChatRoomReqSchema, 'User to start chat with'),
  },
  responses: {
    [R.CREATED]: json(s.chatRoomSchema, 'Created chat room'),
    [R.BAD_REQUEST]: json(C.badRequestSchema, 'Cannot create a chat room with yourself'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.createChatRoomReqSchema), 'The validation error(s)'),
  },
})

export type GetChatRoomsRoute = typeof getChatRooms
export type GetChatHistoryRoute = typeof getChatHistory
export type CreateChatRoomRoute = typeof createChatRoom
