import type { InferRequestType } from '@ichgram/api-client'
import { userApi } from '@/api/user'
import { api } from '@/lib/api-client'
import { handleResponse } from '@/lib/handle-api-response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthentication } from './useAuth'

export type Profile = Awaited<ReturnType<typeof userApi.getCurrentProfile>>

export function useProfile(username?: string, enabled = true) {
  const { isSuccess: isAuthenticated } = useAuthentication()

  const profileQuery = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const response = await api.user[':username'].profile.$get({
        param: { username: username || '' },
      })

      if (response.ok)
        return response.json()

      handleResponse(response)
    },
    enabled: isAuthenticated && !!username && !!enabled,
    staleTime: 1000 * 60 * 5,
  })

  return profileQuery
}

export function useCurrentProfile() {
  const { isSuccess: isAuthenticated } = useAuthentication()

  const data = useQuery({
    queryKey: ['current-user'],
    queryFn: () => userApi.getCurrentProfile(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })

  return data
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: InferRequestType<typeof api.user.me.$patch>['form']) => {
      const response = await api.user.me.$patch({ form: data })
      if (response.ok) {
        return response.json()
      }
      return handleResponse(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })
}
