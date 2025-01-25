import type { loginReqSchema, registerReqSchema } from '@ichgram/api/schemas'
import type { z } from 'zod'
import { api } from '@/lib/api-client'
import formatApiError from '@/lib/format-api-error'

export const authApi = {
  signIn: async (credentials: z.infer<typeof loginReqSchema>) => {
    try {
      const response = await api.auth.login.$post({
        json: credentials,
      })

      const json = await response.json()

      if (response.ok)
        return json

      if ('message' in json)
        throw new Error(json.message)

      if ('success' in json) {
        throw new Error(formatApiError(json))
      }
    }
    catch (error: any) {
      throw new Error(error.message || 'Authentication failed')
    }
  },

  signUp: async (credentials: z.infer<typeof registerReqSchema>) => {
    try {
      const response = await api.auth.register.$post({
        json: credentials,
      })

      const json = await response.json()

      if (response.ok)
        return json

      if ('message' in json)
        throw new Error(json.message)

      if ('success' in json) {
        throw new Error(formatApiError(json))
      }
    }
    catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  },

}
