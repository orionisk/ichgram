import { z } from '@hono/zod-openapi'

export const registerReqSchema = z.object({
  email: z.string().email('Invalid email address').min(5, 'Email must be at least 5 characters').max(255, 'Email must be less than 255 characters').toLowerCase(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be less than 32 characters')
    .regex(
      /^[a-z0-9][\w.-]*$/i,
      'Username can only contain letters, numbers, dots, underscores, and hyphens, and must start with a letter or number',
    )
    .transform(val => val.toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be less than 72 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255, 'Full name must be less than 255 characters').transform(name => name.trim().replace(/\s+/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')),
})

export const loginReqSchema = z.object({
  login: z.string().describe('Email or username'),
  password: z.string(),
})

export const loginResSchema = z.object({
  token: z.string(),
})

export const requestResetReqSchema = registerReqSchema.pick({
  email: true,
})

export const resetPasswordReqSchema = z.object({
  token: z.string(),
  password: registerReqSchema.shape.password,
})

export const resetPasswordResSchema = z.object({
  message: z.string(),
})

export const checkResetTokenReqSchema = z.object({
  token: z.string(),
})
