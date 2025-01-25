import { z } from '@hono/zod-openapi'

export const followResSchema = z.object({
  success: z.boolean(),
})
