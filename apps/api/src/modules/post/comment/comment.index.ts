import { createRouter } from '@api/lib/create-router'
import * as handlers from './comment.handlers'
import * as routes from './comment.routes'
import like from './like/like.index'

const router = createRouter()
  .openapi(routes.createComment, handlers.createComment)
  .openapi(routes.getPostComments, handlers.getPostComments)
  .route('/like', like)
export default router
