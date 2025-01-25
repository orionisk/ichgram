import { createRouter } from '@api/lib/create-router'
import follow from './follow/follow.index'
import * as h from './user.handlers'
import * as r from './user.routes'

const router = createRouter()
  .openapi(r.getUsers, h.getUsers)
  .openapi(r.getCurrentUser, h.getCurrentUser)
  .openapi(r.getUserProfile, h.getUserProfile)
  .openapi(r.updateProfile, h.updateProfile)
  .route('/follow', follow)
export default router
