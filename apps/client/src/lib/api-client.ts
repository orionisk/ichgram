import hcWithType from '@ichgram/api-client'
import { getToken } from './getToken'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = hcWithType(API_URL, {
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
  }),
})
