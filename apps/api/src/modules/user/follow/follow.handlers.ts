import type { AppRouteHandler } from '@api/lib/types'
import type { CreateFollowRoute, DeleteFollowRoute } from './follow.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as followService from './follow.service'

export const createFollow: AppRouteHandler<CreateFollowRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const username = c.req.param('username')

  const result = await followService.createFollow(userId, username)
  return c.json(result, HttpStatusCodes.OK)
}

export const removeFollow: AppRouteHandler<DeleteFollowRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const username = c.req.param('username')

  const result = await followService.removeFollow(userId, username)
  return c.json(result, HttpStatusCodes.OK)
}
