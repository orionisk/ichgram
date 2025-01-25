import { z } from '@hono/zod-openapi'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const imageSchema = z.instanceof(File)
  .describe('Image file')
  .refine(file => file.size <= MAX_FILE_SIZE, {
    message: `Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  })
  .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: `File type must be ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
  })
  .refine(file => file.name.length <= 100, {
    message: 'Filename is too long',
  })
  .refine((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    return ext ? ['jpg', 'jpeg', 'png', 'webp'].includes(ext) : false
  }, {
    message: 'Invalid file extension',
  })
