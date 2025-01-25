import type { JWTPayload } from '@api/types'
import type { Context, Next } from 'hono'
import { AuthenticationError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'
import { jwt, verify } from 'hono/jwt'
import env from '../env'

const AUTH_ERRORS = {
  TOKEN_MISSING: 'Authentication token is required',
  TOKEN_INVALID: 'Token invalid or expired',
} as const

interface VerifiedUser {
  username: string
  id: string
  tokenVersion: number
}

async function verifyTokenAndGetUser(token: string | undefined): Promise<VerifiedUser> {
  if (!token) {
    throw new AuthenticationError(AUTH_ERRORS.TOKEN_MISSING)
  }

  try {
    const payload = (await verify(token, env.JWT_SECRET)) as JWTPayload

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { tokenVersion: true, username: true, id: true },
    })

    if (!user || user.tokenVersion !== payload.version) {
      throw new AuthenticationError(AUTH_ERRORS.TOKEN_INVALID)
    }

    return user
  }
  catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }

    if (error instanceof Error) {
      const isInvalidTokenError = /invalid JWT|signature mismatched/i.test(error.message)
      if (isInvalidTokenError) {
        throw new AuthenticationError(AUTH_ERRORS.TOKEN_INVALID)
      }
    }
    throw error
  }
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const token = c.req.header('Authorization')?.split(' ')[1]
    const user = await verifyTokenAndGetUser(token)

    c.set('username', user.username)

    await jwt({ secret: env.JWT_SECRET })(c, next)
  }
  catch (error) {
    if (error instanceof AuthenticationError) {
      return c.json({ message: error.message }, error.statusCode)
    }
    throw error
  }
}

export async function wsAuth(token: string) {
  const user = await verifyTokenAndGetUser(token)
  return { username: user.username, userId: user.id }
}
