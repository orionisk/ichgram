import { api } from '@/lib/api-client'
import { handleResponse } from '@/lib/handle-api-response'

export const userApi = {
  getCurrentProfile: async () => {
    const response = await api.user.me.$get()
    if (response.ok)
      return response.json()

    handleResponse(response)
  },

  getUserProfile: async (username?: string) => {
    const response = await api.user[':username'].profile.$get({
      param: { username: username || '' },
    })

    if (response.ok)
      return response.json()

    return handleResponse(response)
  },

  updateProfile: async (data: {
    username?: string
    bio?: string
    website?: string
    avatar?: File
  }) => {
    const response = await api.user.me.$patch({
      form: {
        username: data.username,
        bio: data.bio,
        website: data.website,
        avatar: data.avatar,
      },
    })

    return handleResponse(response)
  },
}
