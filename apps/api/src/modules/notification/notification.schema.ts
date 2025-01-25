import { z } from '@hono/zod-openapi'

export const notificationResSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['like', 'comment', 'follow']),
      userId: z.string(),
      fromId: z.string(),
      postId: z.string().nullable(),
      read: z.boolean(),
      createdAt: z.string(),
      targetImage: z.string().nullable().optional(),
      user: z.object({
        id: z.string(),
        username: z.string(),
        fullName: z.string(),
        avatarUrl: z.string().nullable(),
      }),
      fromUser: z.object({
        id: z.string(),
        username: z.string(),
        fullName: z.string(),
        avatarUrl: z.string().nullable(),
      }),
    }),
  ),
})

export const notificationIdsSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one notification ID is required'),
})
