import type { ChatMessage } from '@prisma/client'
import type { WSContext } from 'hono/ws'

interface ConnectedClient {
  userId: string
  ws: WSContext<any>
}

export class ChatWebSocketManager {
  private connectedClients: ConnectedClient[] = []

  getConnectedClients() {
    return this.connectedClients
  }

  addClient(userId: string, ws: WSContext<any>) {
    this.connectedClients.push({ userId, ws })
  }

  removeClient(userId: string) {
    this.connectedClients = this.connectedClients.filter(
      client => client.userId !== userId,
    )
  }

  notifyNewMessage(receiverId: string, message: ChatMessage) {
    const receiverClient = this.connectedClients.find(
      client => client.userId === receiverId,
    )

    if (receiverClient) {
      receiverClient.ws.send(JSON.stringify({
        type: 'new_message',
        data: message,
      }))
    }
  }

  notifyTyping(senderId: string, receiverId: string) {
    const receiverClient = this.connectedClients.find(
      client => client.userId === receiverId,
    )

    if (receiverClient) {
      receiverClient.ws.send(JSON.stringify({
        type: 'user_typing',
        data: {
          userId: senderId,
        },
      }))
    }
  }
}

export const chatWsManager = new ChatWebSocketManager()
