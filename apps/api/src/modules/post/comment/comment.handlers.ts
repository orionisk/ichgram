import type { AppRouteHandler } from '@api/lib/types'
import type { CreateCommentRoute, GetPostCommentsRoute } from './comment.routes'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as commentService from './comment.service'

export const createComment: AppRouteHandler<CreateCommentRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('postId')
  const { content } = c.req.valid('json')

  const comment = await commentService.createComment({
    content,
    postId,
    userId,
  })

  return c.json(comment, HttpStatusCodes.OK)
}

export const getPostComments: AppRouteHandler<GetPostCommentsRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const postId = c.req.param('postId')
  const { page, limit } = c.req.valid('query')

  const comments = await commentService.getPostComments(postId, userId, page, limit)
  return c.json(comments, HttpStatusCodes.OK)
}
