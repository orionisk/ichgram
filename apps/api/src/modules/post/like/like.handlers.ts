import type { AppRouteHandler } from '@api/lib/types'
import type { CreateLikeRoute, DeleteLikeRoute } from './like.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as likeService from './like.service'

export const create: AppRouteHandler<CreateLikeRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('id')

  const result = await likeService.createLike(postId, userId)
  return c.json(result, HttpStatusCodes.OK)
}

export const remove: AppRouteHandler<DeleteLikeRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('id')

  const result = await likeService.deleteLike(postId, userId)
  return c.json(result, HttpStatusCodes.OK)
}
