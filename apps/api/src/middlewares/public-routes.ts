import type { MiddlewareHandler } from 'hono'
import env from '../env'
import { authMiddleware } from './auth'

const PUBLIC_PATHS = [
  'auth/login',
  'auth/register',
  'auth/password-reset',
  'auth/password-reset/request',
  'auth/password-reset/check',
  'reference',
  'doc',
  'chat/ws',
] as const

export const publicRoutesMiddleware: MiddlewareHandler = async (c, next) => {
  if (!c.req.path.startsWith(env.BASE_PATH))
    return next()

  const path = c.req.path.slice(env.BASE_PATH.length + 1)

  if (PUBLIC_PATHS.some(publicPath => path === publicPath || path.startsWith(`${publicPath}/`)))
    return next()

  return authMiddleware(c, next)
}
