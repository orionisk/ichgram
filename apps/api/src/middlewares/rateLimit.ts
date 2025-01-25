import { getConnInfo } from '@hono/node-server/conninfo'
import { rateLimiter } from 'hono-rate-limiter'

interface RateLimitOptions {
  windowMs: number
  limit: number
  message?: string
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, limit, message } = options

  return rateLimiter({
    windowMs,
    limit,
    message,
    keyGenerator: (c) => {
      const ip = c.req.header('x-forwarded-for')
        || c.req.header('x-real-ip')
        || c.req.header('cf-connecting-ip')
        || getConnInfo(c).remote.address
        || 'unknown'
      const path = c.req.path
      return `${ip}:${path}`
    },
  })
}
