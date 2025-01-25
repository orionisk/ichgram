import type { AppRouteHandler } from '@api/lib/types'
import type {
  GetNotificationsRoute,
  GetUnreadCountRoute,
  MarkAllAsReadRoute,
  MarkAsReadRoute,
} from './notification.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as notificationService from './notification.service'

export const getNotifications: AppRouteHandler<
  GetNotificationsRoute
> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const result = await notificationService.getNotifications(userId)
  return c.json(result, HttpStatusCodes.OK)
}

export const getUnreadCount: AppRouteHandler<GetUnreadCountRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const result = await notificationService.getUnreadCount(userId)
  return c.json(result, HttpStatusCodes.OK)
}

export const markAsRead: AppRouteHandler<MarkAsReadRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const { ids } = c.req.valid('json')
  const result = await notificationService.markAsRead(userId, ids)
  return c.json(result, HttpStatusCodes.OK)
}

export const markAllAsRead: AppRouteHandler<MarkAllAsReadRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const result = await notificationService.markAllAsRead(userId)
  return c.json(result, HttpStatusCodes.OK)
}
