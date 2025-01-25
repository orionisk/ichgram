import type { AppRouteHandler } from '@api/lib/types'
import type { CheckAuthRoute, CheckResetTokenRoute, LoginRoute, RegisterRoute, RequestPasswordResetRoute, ResetPasswordRoute } from './auth.routes'
import * as authService from '@api/modules/auth/auth.service'
import * as R from 'stoker/http-status-codes'

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const credentials = c.req.valid('json')
  const result = await authService.login(credentials)
  return c.json(result, R.OK)
}

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const credentials = c.req.valid('json')
  const result = await authService.register(credentials)
  return c.json(result, R.OK)
}

export const requestPasswordReset: AppRouteHandler<RequestPasswordResetRoute> = async (c) => {
  const { email } = c.req.valid('json')
  const result = await authService.requestPasswordReset(email)
  return c.json(result, R.OK)
}

export const resetPassword: AppRouteHandler<ResetPasswordRoute> = async (c) => {
  const { token, password } = c.req.valid('json')
  const result = await authService.resetPassword(token, password)
  return c.json(result, R.OK)
}

export const checkResetToken: AppRouteHandler<CheckResetTokenRoute> = async (c) => {
  const { token } = c.req.query()
  const result = await authService.checkResetToken(token)
  return c.json(result, R.OK)
}

export const checkAuth: AppRouteHandler<CheckAuthRoute> = async (c) => {
  return c.json({ success: true }, R.OK)
}
