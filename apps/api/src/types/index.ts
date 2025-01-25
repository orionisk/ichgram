import type { Context, ContextVariableMap as HonoContextVariableMap } from 'hono'
import type { JWTPayload as HonoJWTPayload } from 'hono/utils/jwt/types'

export interface User {
  id: string
  email: string
  username: string
  name?: string
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  content?: string
  image: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

interface Variables {
  userId: string
  jwtPayload: any
  validated: any
}

export type AuthRequest = Context<{
  Variables: Variables
}>

export interface ContextVariableMap extends HonoContextVariableMap {
  userId: string
  jwtPayload: JWTPayload
}

export interface JWTPayload extends HonoJWTPayload {
  id: string
  version: number
  username: string
  [key: string]: unknown
}
