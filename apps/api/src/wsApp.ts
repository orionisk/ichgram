import type { Hono } from 'hono'

import { createNodeWebSocket } from '@hono/node-ws'
import createApp from './lib/create-app'

const { app } = createApp()
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app: app as unknown as Hono })

export { app, injectWebSocket, upgradeWebSocket }
