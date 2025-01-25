import type { AppRouteHandler } from '@api/lib/types'
import type { CreateChatRoomRoute, GetChatHistoryRoute, GetChatRoomsRoute } from './chat.routes'
import { wsAuth } from '@api/middlewares/auth'
import { upgradeWebSocket } from '@api/wsApp'
import * as R from 'stoker/http-status-codes'
import { wsMessageSchema } from './chat.schema'
import * as chatService from './chat.service'
import { chatWsManager } from './chat.ws-manager'

export const getChatRooms: AppRouteHandler<GetChatRoomsRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const rooms = await chatService.getChatRooms(userId)
  return c.json(rooms, R.OK)
}

export const getChatHistory: AppRouteHandler<GetChatHistoryRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const { page, limit } = c.req.query()
  const otherUserId = c.req.param('userId')
  const messages = await chatService.getChatHistory(userId, otherUserId, +page, +limit)
  return c.json(messages, R.OK)
}

export const handleWebSocket = upgradeWebSocket((c) => {
  const token = c.req.query('token')
  let authenticatedUserId: string | null = null

  if (!token) {
    return {
      onOpen: (_, ws) => {
        ws.send(JSON.stringify({ type: 'error', message: 'No token provided' }))
        ws.close(1008, 'No token provided')
      },
    }
  }

  return {
    onOpen: async (_, ws) => {
      try {
        const { userId } = await wsAuth(token)
        authenticatedUserId = userId
        chatWsManager.addClient(userId, ws)
        ws.send(JSON.stringify({ type: 'connected', userId }))
      }
      catch {
        ws.send(JSON.stringify({ type: 'error', message: 'Authentication failed' }))
        ws.close(1008, 'Authentication failed')
      }
    },
    onMessage: async (event, ws) => {
      if (!authenticatedUserId) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }))
        ws.close(1008, 'Not authenticated')
        return
      }

      try {
        const rawData = JSON.parse(event.data)
        const validationResult = wsMessageSchema.safeParse(rawData)

        if (!validationResult.success) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
            errors: validationResult.error.errors,
          }))
          return
        }

        const data = validationResult.data

        switch (data.type) {
          case 'message': {
            const message = await chatService.sendMessage(
              authenticatedUserId,
              data.receiverId,
              data.content,
            )

            ws.send(JSON.stringify({
              type: 'message_sent',
              data: message,
            }))

            chatWsManager.notifyNewMessage(data.receiverId, message)
            break
          }

          case 'typing': {
            chatWsManager.notifyTyping(authenticatedUserId, data.receiverId)
            break
          }

          case 'read': {
            // TODO: Implement read receipts
            break
          }
        }
      }
      catch {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message',
        }))
      }
    },
    onClose: () => {
      if (authenticatedUserId) {
        chatWsManager.removeClient(authenticatedUserId)
      }
    },
    onError: () => {
      console.error('WebSocket error')
    },
  }
})

export const createChatRoom: AppRouteHandler<CreateChatRoomRoute> = async (c) => {
  const { id: userId } = c.get('jwtPayload')
  const { participantId } = await c.req.json()

  const room = await chatService.createChatRoom(userId, participantId)
  return c.json(room, R.CREATED)
}
