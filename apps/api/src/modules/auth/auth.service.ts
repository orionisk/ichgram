import type { z } from 'zod'
import type { loginReqSchema, registerReqSchema } from './auth.schema'
import { randomBytes } from 'node:crypto'
import env from '@api/env'
import { AuthenticationError, ConflictError, NotFoundError } from '@api/types/error'
import { prisma } from '@api/utils/prisma'
import bcrypt from 'bcrypt'
import { addHours } from 'date-fns'
import { sign } from 'hono/jwt'
import { Resend } from 'resend'

export async function register(credentials: z.infer<typeof registerReqSchema>) {
  const existingEmail = await prisma.user.findUnique({
    where: { email: credentials.email },
  })
  if (existingEmail) {
    throw new ConflictError('Email already registered')
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: credentials.username },
  })
  if (existingUsername) {
    throw new ConflictError('Username already taken')
  }

  const hash = await bcrypt.hash(credentials.password, 10)

  const user = await prisma.user.create({
    data: {
      email: credentials.email,
      username: credentials.username,
      fullName: credentials.fullName,
      password: hash,
    },
  })

  const token = await sign(
    {
      id: user.id,
      version: user.tokenVersion,
    },
    env.JWT_SECRET,
  )

  return { token }
}

export async function login(credentials: z.infer<typeof loginReqSchema>) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: credentials.login }, { username: credentials.login }],
    },
  })

  if (!user) {
    throw new AuthenticationError('Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid credentials')
  }

  const token = await sign(
    {
      id: user.id,
      version: user.tokenVersion,
    },
    env.JWT_SECRET,
  )

  return { token }
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new NotFoundError('Email not found')
  }

  const resetToken = randomBytes(32).toString('hex')
  const resetTokenExpires = addHours(new Date(), 1)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: await bcrypt.hash(resetToken, 10),
      resetTokenExpires,
    },
  })

  const resend = new Resend(env.RESEND_API_KEY)

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: user.email,
    subject: 'Password Reset',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${env.CLIENT_URL}/reset-password-new?token=${resetToken}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })

  return { message: 'Password reset email sent' }
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  })

  if (!user || !user.resetToken) {
    throw new AuthenticationError('Invalid or expired reset token')
  }

  const isValidToken = await bcrypt.compare(token, user.resetToken)
  if (!isValidToken) {
    throw new AuthenticationError('Invalid or expired reset token')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
      tokenVersion: {
        increment: 1,
      },
    },
  })

  return { message: 'Password successfully reset' }
}

export async function checkResetToken(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  })

  if (!user || !user.resetToken) {
    throw new AuthenticationError('Invalid or expired reset token')
  }

  const isValidToken = await bcrypt.compare(token, user.resetToken)
  if (!isValidToken) {
    throw new AuthenticationError('Invalid or expired reset token')
  }

  return { message: 'Password reset token is valid' }
}
