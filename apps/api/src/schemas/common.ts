import { z } from '@hono/zod-openapi'

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{24}$/i, 'Invalid MongoDB ObjectId format').openapi({ description: 'Post ID' }),
})

export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }),
  })
}

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})
