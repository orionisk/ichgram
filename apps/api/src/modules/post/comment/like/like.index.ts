import { createRouter } from '@api/lib/create-router'
import * as handlers from './like.handlers'
import * as routes from './like.routes'

const router = createRouter()
  .openapi(routes.createCommentLike, handlers.createCommentLike)
  .openapi(routes.deleteCommentLike, handlers.removeCommentLike)

export default router
