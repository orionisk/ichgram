import type { AppOpenAPI } from '../lib/types'
import { rateLimit } from '@api/middlewares/rateLimit'
import env from '../env'
import { createRouter } from '../lib/create-router'
import { publicRoutesMiddleware } from '../middlewares/public-routes'
import { auth, chat, notification, post, user } from './index'

export function registerRoutes(app: AppOpenAPI) {
  if (env.ENABLE_AUTH)
    app.use(publicRoutesMiddleware)

  if (env.NODE_ENV === 'production') {
    app.use(
      '/auth/*',
      rateLimit({
        windowMs: 60 * 1000,
        limit: 100,
      }),
    )

    app.use(
      '*',
      rateLimit({
        windowMs: 60 * 1000,
        limit: 1000,
      }),
    )
  }

  return app
    .route('/auth', auth)
    .route('/user', user)
    .route('/posts', post)
    .route('/notification', notification)
    .route('/chat', chat)
}

export const router = registerRoutes(
  createRouter().basePath(env.BASE_PATH),
)
export type Router = typeof router
