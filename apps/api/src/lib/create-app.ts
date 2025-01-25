import type { AppOpenAPI } from './types'
import { pinoLogger } from '@api/middlewares/pino-logger'

import { cors } from 'hono/cors'
import { notFound, serveEmojiFavicon } from 'stoker/middlewares'
import env from '../env'
import { errorHandler } from '../middlewares/error-handler'
import { createRouter } from './create-router'

export default function createApp() {
  const app = createRouter()
    .use('*', async (c, next) => {
      if (c.req.header('Upgrade') === 'websocket')
        return next()

      return cors({
        origin: [env.CLIENT_URL],
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })(c, next)
    })
    .basePath(env.BASE_PATH ?? '') as AppOpenAPI

  app.use(serveEmojiFavicon('📝'))
  app.use(pinoLogger())
  app.notFound(notFound)
  app.onError(errorHandler)
  return { app }
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().app.route('/', router)
}
