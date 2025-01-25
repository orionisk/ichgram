import path from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import { z } from 'zod'

expand(
  config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    ),
  }),
)

const EnvSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(3000),
    LOG_LEVEL: z.enum([
      'fatal',
      'error',
      'warn',
      'info',
      'debug',
      'trace',
      'silent',
    ]),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    JWT_SECRET: z.string(),
    BASE_PATH: z.string().default('/api'),
    ENABLE_AUTH: z.preprocess(val => val !== 'false', z.boolean()),
    UPLOADTHING_TOKEN: z.string().nonempty(),
    RESEND_API_KEY: z.string().nonempty(),
    EMAIL_FROM: z.string().nonempty(),
    CLIENT_URL: z.string().nonempty(),
  })

export type Env = z.infer<typeof EnvSchema>

const result = EnvSchema.safeParse(process.env)
const env = result.success ? result.data : null
const error = result.success ? null : result.error

if (error) {
  console.error('❌ Invalid env:')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export default env!
