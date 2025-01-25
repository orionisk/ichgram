import * as C from '@api/lib/constants'
import { createRoute, z } from '@hono/zod-openapi'
import * as R from 'stoker/http-status-codes'
import { jsonContent as json, jsonContentRequired as jsonReq } from 'stoker/openapi/helpers'
import { createErrorSchema as error } from 'stoker/openapi/schemas'
import * as s from './auth.schema'

const tags = ['Auth']

export const checkAuth = createRoute({
  path: '/check-auth',
  method: 'get',
  tags,
  security: [{ bearerAuth: [] }],
  description: 'Check if the user is authenticated',
  summary: 'Check if the user is authenticated',
  responses: {
    [R.OK]: json(z.object({ success: z.boolean() }), 'User authentication status'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'User is not authenticated'),
  },
})

export const login = createRoute({
  path: '/login',
  method: 'post',
  request: {
    body: jsonReq(s.loginReqSchema, 'User login data'),
  },
  tags,
  description: 'Login a user',
  summary: 'Login a user',
  responses: {
    [R.OK]: json(s.loginResSchema, 'JWT token for the logged in user'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Invalid credentials'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.loginReqSchema), 'The validation error(s)'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'User not found'),
  },
})

export const register = createRoute({
  path: '/register',
  method: 'post',
  request: {
    body: jsonReq(s.registerReqSchema, 'User registration data'),
  },
  tags,
  description: 'Register a new user',
  summary: 'Register a new user',
  responses: {
    [R.OK]: json(s.loginResSchema, 'JWT token for the registered user'),
    [R.CONFLICT]: json(C.conflictSchema, 'Email already registered'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.registerReqSchema), 'The validation error(s)'),
  },
})

export const requestPasswordReset = createRoute({
  path: '/password-reset/request',
  method: 'post',
  request: {
    body: jsonReq(
      s.requestResetReqSchema,
      'Password reset request data',
    ),
  },
  tags,
  description: 'Request a password reset',
  summary: 'Request a password reset',
  responses: {
    [R.OK]: json(z.object({ message: z.string() }), 'Password reset email sent'),
    [R.NOT_FOUND]: json(C.notFoundSchema, 'Email not found'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.requestResetReqSchema), 'The validation error(s)'),
  },
})

export const resetPassword = createRoute({
  path: '/password-reset',
  method: 'post',
  request: {
    body: jsonReq(s.resetPasswordReqSchema, 'Password reset data'),
  },
  tags,
  description: 'Reset a user password',
  summary: 'Reset a user password',
  responses: {
    [R.OK]: json(s.resetPasswordResSchema, 'Password successfully reset'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.resetPasswordReqSchema), 'The validation error(s)'),
  },
})

export const checkResetToken = createRoute({
  path: '/password-reset/check',
  method: 'get',
  tags,
  request: {
    query: s.checkResetTokenReqSchema,
  },
  description: 'Check a password reset token',
  summary: 'Check a password reset token',
  responses: {
    [R.OK]: json(s.resetPasswordResSchema, 'Password reset token is valid'),
    [R.UNAUTHORIZED]: json(C.unauthorizedSchema, 'Invalid or expired reset token'),
    [R.UNPROCESSABLE_ENTITY]: json(error(s.checkResetTokenReqSchema), 'The validation error(s)'),
  },
})

export type RegisterRoute = typeof register
export type LoginRoute = typeof login
export type RequestPasswordResetRoute = typeof requestPasswordReset
export type ResetPasswordRoute = typeof resetPassword
export type CheckResetTokenRoute = typeof checkResetToken
export type CheckAuthRoute = typeof checkAuth
