import { createRouter } from '@api/lib/create-router'
import * as handlers from './like.handlers'
import * as routes from './like.routes'

const router = createRouter()
  .openapi(routes.createLike, handlers.create)
  .openapi(routes.deleteLike, handlers.remove)
export default router
