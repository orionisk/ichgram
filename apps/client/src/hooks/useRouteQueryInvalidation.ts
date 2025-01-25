import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation } from 'wouter'

const routeQueryKeys: Record<string, string[]> = {
  '/': ['posts'],
  '/explore': ['explore-posts'],
  '/profile': ['current-user', 'user-posts'],
  '/users/:username': ['profile', 'user-posts'],
  '/messages': ['chatRooms', 'chatMessages'],
}

export function useRouteQueryInvalidation() {
  const [location] = useLocation()
  const queryClient = useQueryClient()

  useEffect(() => {
    const basePath = location.split('/').slice(0, 3).join('/')
    const queryKeys = routeQueryKeys[basePath]

    if (queryKeys) {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  }, [location, queryClient])
}
