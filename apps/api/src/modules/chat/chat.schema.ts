import { paginatedResponseSchema } from '@api/schemas/common'
import { z } from '@hono/zod-openapi'

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message too long')
    .openapi({ example: 'Hello!' }),
})

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  createdAt: z.string(),
  sender: z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
})

export const getChatHistoryResSchema = paginatedResponseSchema(chatMessageSchema)

export const chatRoomSchema = z.object({
  id: z.string(),
  participants: z.array(z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
  })),
  lastMessage: chatMessageSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const getChatRoomsResSchema = z.array(chatRoomSchema)

export const wsMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('message'),
    receiverId: z.string(),
    content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  }),
  z.object({
    type: z.literal('typing'),
    receiverId: z.string(),
  }),
  z.object({
    type: z.literal('read'),
    messageId: z.string(),
  }),
])

export const createChatRoomReqSchema = z.object({
  participantId: z.string(),
})

export const wsQuerySchema = z.object({
  token: z.string(),
})
