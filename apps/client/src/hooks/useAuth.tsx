import { authApi } from '@/api/auth'
import { api } from '@/lib/api-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'wouter'

export function useAuthOperations() {
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()

  const login = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async (data) => {
      if (data && 'token' in data) {
        localStorage.setItem('ichgram-token', data.token)
        await queryClient.refetchQueries({ queryKey: ['check-auth'] })
        setLocation('/')
      }
    },
  })

  const register = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: async (data) => {
      if (data && 'token' in data) {
        localStorage.setItem('ichgram-token', data.token)
        await queryClient.refetchQueries({ queryKey: ['check-auth'] })
        setLocation('/')
      }
    },
  })

  const logout = () => {
    localStorage.removeItem('ichgram-token')
    queryClient.clear()
    setLocation('/login')
  }

  return {
    login,
    register,
    logout,
  }
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: (email: string) => api.auth['password-reset'].request.$post({ json: { email } }),
  })
}

export function useCheckResetToken(token?: string) {
  return useQuery({
    queryKey: ['check-reset-token'],
    queryFn: async () => {
      const response = await api.auth['password-reset'].check.$get({ query: { token: token! } })

      if (!response.ok) {
        throw new Error('Invalid or expired reset token')
      }

      return response.json()
    },
    enabled: !!token,
    retry: (failureCount, error) => error instanceof Error ? false : failureCount < 3,
  })
}

export function useAuthentication() {
  return useQuery({
    queryKey: ['check-auth'],
    queryFn: async () => {
      const response = await api.auth['check-auth'].$get()
      if (!response.ok) {
        localStorage.removeItem('ichgram-token')
        throw new Error('User is not authenticated')
      }
      return true
    },
    retry: false,
    retryOnMount: true,
    staleTime: 1000 * 60 * 5,
  })
}
