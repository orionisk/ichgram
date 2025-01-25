import { createRouter } from '@api/lib/create-router'

import * as handlers from './auth.handlers'
import * as routes from './auth.routes'

const router = createRouter()

export default router
  .openapi(routes.login, handlers.login)
  .openapi(routes.register, handlers.register)
  .openapi(routes.requestPasswordReset, handlers.requestPasswordReset)
  .openapi(routes.resetPassword, handlers.resetPassword)
  .openapi(routes.checkResetToken, handlers.checkResetToken)
  .openapi(routes.checkAuth, handlers.checkAuth)
