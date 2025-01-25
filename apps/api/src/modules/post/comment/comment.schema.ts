import { paginatedResponseSchema } from '@api/schemas/common'
import { z } from '@hono/zod-openapi'

export const createCommentReqSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(200, 'Comment must be at most 200 characters')
    .openapi({ example: 'Great post!' }),
})

export const createCommentResSchema = z.object({
  id: z.string(),
  content: z.string(),
  postId: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z.object({
    likes: z.number(),
  }),
  hasLiked: z.boolean(),
})

export const getPostCommentsResSchema = paginatedResponseSchema(createCommentResSchema)
