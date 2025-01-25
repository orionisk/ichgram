import { serve } from '@hono/node-server'
import { app } from './app'
import env from './env'
import { injectWebSocket } from './wsApp'

const port = env.PORT
console.log(`Server is running on port http://localhost:${port}`)

const server = serve({
  fetch: app.fetch,
  port,
})

injectWebSocket(server)
