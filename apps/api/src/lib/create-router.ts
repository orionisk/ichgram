import type { AppBindings } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'

import { defaultHook } from 'stoker/openapi'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}
