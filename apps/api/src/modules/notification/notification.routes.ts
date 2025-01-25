import * as C from '@api/lib/constants'
import { createRoute, z } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json, jsonContentRequired as jsonReq } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as s from './notification.schema'

export const getNotifications = createRoute({
  method: 'get',
  path: '/',
  security: [{ bearerAuth: [] }],
  tags: ['Notifications'],
  summary: 'Get user notifications',
  description: 'Get user notifications',
  responses: {
    [R.OK]: json(s.notificationResSchema, 'User notifications'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
  },
})

export const getUnreadCount = createRoute({
  method: 'get',
  path: '/unread/count',
  security: [{ bearerAuth: [] }],
  tags: ['Notifications'],
  summary: 'Get unread notifications count',
  description: 'Get unread notifications count',
  responses: {
    [R.OK]: json(z.object({ count: z.number() }), 'Unread notifications count'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
  },
})

export const markAsRead = createRoute({
  method: 'post',
  path: '/read',
  security: [{ bearerAuth: [] }],
  tags: ['Notifications'],
  summary: 'Mark notifications as read',
  description: 'Mark notifications as read',
  request: {
    body: jsonReq(s.notificationIdsSchema, 'Notification IDs to mark as read'),
  },
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'Notifications marked as read'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.notificationIdsSchema), 'Validation error'),
  },
})

export const markAllAsRead = createRoute({
  method: 'post',
  path: '/read/all',
  security: [{ bearerAuth: [] }],
  tags: ['Notifications'],
  summary: 'Mark all notifications as read',
  description: 'Mark all notifications as read',
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'All notifications marked as read'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Unauthorized'),
  },
})

export type GetNotificationsRoute = typeof getNotifications
export type GetUnreadCountRoute = typeof getUnreadCount
export type MarkAsReadRoute = typeof markAsRead
export type MarkAllAsReadRoute = typeof markAllAsRead
