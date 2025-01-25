import { imageSchema } from '@api/core/storage/storage.schema'
import { registerReqSchema } from '@api/schemas'
import { z } from '@hono/zod-openapi'

export const updateProfileReqSchema = z.object({
  avatar: imageSchema.optional().nullable(),
  username: registerReqSchema.shape.username.optional(),
  bio: z.string().max(90, 'Bio must be less than 90 characters').optional(),
  website: z.string()
    .max(20, 'Website URL must be less than 20 characters')
    .transform(s => s.trim())
    .refine(
      val => val === '' || /^(?:https?:\/\/)?[-\w@:%.+~#=]{1,256}\.[a-z0-9()]{1,6}\b[-\w()@:%+.~#?&/=]*$/i.test(val),
      'Please enter a valid website URL',
    )
    .transform(url => url.toLowerCase())
    .optional()
    .default(''),
})

export const updateProfileResSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
})

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullName: z.string(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  website: z.string().nullable(),
})

export const getCurrentUserResSchema = userSchema.extend({
  _count: z.object({
    followers: z.number(),
    following: z.number(),
    posts: z.number(),
  }),
})

export const getUserResSchema = userSchema.extend({
  _count: z.object({
    followers: z.number(),
    following: z.number(),
    posts: z.number(),
  }),
  isFollowing: z.boolean(),
})

export const getUsersReqSchema = z.object({
  name: z.string().optional(),
})

export const getUsersResSchema = z.array(
  z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
)
