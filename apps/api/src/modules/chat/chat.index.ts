import { createRouter } from '@api/lib/create-router'
import * as handlers from './chat.handlers'
import * as routes from './chat.routes'

const router = createRouter()
  .openapi(routes.getChatRooms, handlers.getChatRooms)
  .openapi(routes.getChatHistory, handlers.getChatHistory)
  .openapi(routes.createChatRoom, handlers.createChatRoom)
  .get('/ws', handlers.handleWebSocket)

export default router
