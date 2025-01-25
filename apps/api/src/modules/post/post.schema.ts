import { imageSchema } from '@api/core/storage/storage.schema'
import { paginatedResponseSchema } from '@api/schemas/common'
import { z } from '@hono/zod-openapi'

export const createPostReqSchema = z.object({
  content: z
    .string()
    .max(200, 'Post content too long')
    .nullable()
    .openapi({ description: 'Post content' }),
  image: imageSchema,
})

export const updatePostReqSchema = z.object({
  content: z
    .string()
    .max(200, 'Post content too long')
    .nullable()
    .openapi({ description: 'Post content' }),
  image: imageSchema.optional(),
})

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
})

export const getPostResSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  imageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: userSchema,
  _count: z
    .object({
      likes: z.number(),
    })
    .optional(),
  isLiked: z.boolean().optional(),
})

export const getPostsResSchema = paginatedResponseSchema(
  z.object({
    id: z.string(),
    content: z.string().nullable(),
    imageUrl: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    author: userSchema,
    _count: z.object({
      likes: z.number(),
      comments: z.number(),
    }),
    isLiked: z.boolean(),
  }),
)

export const getUserPostsResSchema = paginatedResponseSchema(
  z.object({
    id: z.string(),
    imageUrl: z.string(),
  }),
)

export const getExplorePostsResSchema = z.array(
  z.object({
    id: z.string(),
    imageUrl: z.string(),
  }),
)
