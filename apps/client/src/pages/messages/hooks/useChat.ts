import type { ChatRoom } from '@/types'
import { api } from '@/lib/api-client'
import { handleResponse } from '@/lib/handle-api-response'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useChatRooms() {
  const query = useQuery({
    queryKey: ['chatRooms'],
    queryFn: async () => {
      const res = await api.chat.rooms.$get()
      const rooms = await res.json()
      return rooms as ChatRoom[]
    },
  })

  return query
}

export function useChatMessages(userId: string) {
  const query = useInfiniteQuery({
    queryKey: ['chatMessages', userId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId)
        return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }

      const response = await api.chat.history[':userId'].$get({
        param: { userId },
        query: {
          page: pageParam,
          limit: 30,
        },
      })

      if (response.ok)
        return response.json()
      handleResponse(response)
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination.page && lastPage?.pagination.page < lastPage?.pagination.pages)
        return lastPage.pagination.page + 1
      return undefined
    },
    select: data => ({
      pages: data.pages,
      pageParams: data.pageParams,
      messages: data.pages.flatMap(page => page?.items ?? []).reverse(),
    }),
    initialPageParam: 1,
    enabled: !!userId,
  })

  return {
    ...query,
    messages: query.data?.messages ?? [],
  }
}
