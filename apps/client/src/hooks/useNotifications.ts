import { api } from '@/lib/api-client'
import { handleResponse } from '@/lib/handle-api-response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.notification.read.$post({ json: { ids } })
      if (!response.ok)
        throw new Error('Failed to mark notifications as read')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.notification.read.all.$post()
      if (!response.ok)
        throw new Error('Failed to mark all notifications as read')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
    },
  })
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const response = await api.notification.unread.count.$get()
      if (response.ok)
        return response.json()
      throw new Error('Failed to fetch unread notifications count')
    },
    refetchInterval: 30 * 1000,
    refetchIntervalInBackground: true,
    staleTime: 30 * 1000,
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.notification.$get()
      if (response.ok)
        return response.json()
      return handleResponse(response)
    },
    refetchOnWindowFocus: false,
  })
}
