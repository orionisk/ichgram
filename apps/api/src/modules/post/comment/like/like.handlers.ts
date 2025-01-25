import type { AppRouteHandler } from '@api/lib/types'
import type { CreateCommentLikeRoute, DeleteCommentLikeRoute } from './like.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as commentLikeService from './like.service'

export const createCommentLike: AppRouteHandler<CreateCommentLikeRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const commentId = c.req.param('commentId')

  const result = await commentLikeService.createCommentLike(commentId, userId)
  return c.json(result, HttpStatusCodes.OK)
}

export const removeCommentLike: AppRouteHandler<DeleteCommentLikeRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const commentId = c.req.param('commentId')

  const result = await commentLikeService.deleteCommentLike(commentId, userId)
  return c.json(result, HttpStatusCodes.OK)
}
