import { createRouter } from '@api/lib/create-router'
import * as handlers from './follow.handlers'
import * as routes from './follow.routes'

const router = createRouter()
  .openapi(routes.createFollow, handlers.createFollow)
  .openapi(routes.deleteFollow, handlers.removeFollow)

export default router
