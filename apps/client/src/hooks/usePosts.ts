import { api } from '@/lib/api-client'
import { handleResponse } from '@/lib/handle-api-response'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function usePosts(limit = 10) {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.posts.$get({
        query: {
          page: pageParam,
          limit,
        },
      })

      if (response.ok)
        return response.json()

      const error = await handleResponse(response)
      throw error
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages)
        return lastPage.pagination.page + 1
      return undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  })
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: ['user-posts', username],
    queryFn: async ({ pageParam = 1 }) => {
      if (!username)
        return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } }

      const response = await api.posts.user[':username'].$get({
        param: { username },
        query: {
          page: pageParam,
          limit: 12,
        },
      })

      if (response.ok)
        return response.json()
      handleResponse(response)
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page && lastPage?.pagination?.pages && lastPage?.pagination?.page < lastPage?.pagination?.pages)
        return lastPage.pagination.page + 1
      return undefined
    },
    initialPageParam: 1,
    enabled: !!username,
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
  })
}

export function usePost(postId: string, enabled: boolean) {
  const query = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await api.posts.id[':id'].$get({
        param: {
          id: postId,
        },
      })
      if (response.ok)
        return response.json()
      if ([422, 404].includes(response.status))
        throw new Error('Post not found', { cause: response.status })
      throw new Error('Failed to fetch post')
    },
    retry: (failureCount, error) => error instanceof Error ? false : failureCount < 3,
    enabled: !!postId && enabled,
  })
  return query
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { image: File, content: string }) => {
      const response = await api.posts.$post({
        form: data,
      })

      if (response.ok)
        return response.json()
      handleResponse(response)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })
}

export function usePostComments(postId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['post-comments', postId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.posts.comments[':postId'].$get({
        param: { postId },
        query: {
          page: pageParam,
          limit: 15,
        },
      })

      if (response.ok)
        return response.json()
      throw new Error('Failed to fetch comments')
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages)
        return lastPage.pagination.page + 1
      return undefined
    },
    initialPageParam: 1,
    enabled: !!postId && enabled,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { postId: string, content: string }) => {
      const response = await api.posts.comments[':postId'].$post({
        json: {
          content: data.content,
        },
        param: {
          postId: data.postId,
        },
      })
      if (!response.ok)
        handleResponse(response)

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] })
    },
  })
}

export function usePostLikes(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      const response = await (isLiked
        ? api.posts.like[':id'].$delete({ param: { id: postId } })
        : api.posts.like[':id'].$post({ param: { id: postId } }))

      if (!response.ok)
        handleResponse(response)

      return response.json()
    },
    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      const previousPost = queryClient.getQueryData(['post', postId])
      const previousPosts = queryClient.getQueryData(['posts'])

      queryClient.setQueryData(['post', postId], (old: any) => {
        if (!old)
          return old

        return {
          ...old,
          isLiked: !isLiked,
          _count: {
            ...old._count,
            likes: (old._count?.likes ?? 0) + (isLiked ? -1 : 1),
          },
        }
      })

      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old?.pages)
          return old

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: any) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !isLiked,
                  _count: {
                    ...post._count,
                    likes: (post._count?.likes ?? 0) + (isLiked ? -1 : 1),
                  },
                }
              }
              return post
            }),
          })),
        }
      })

      return { previousPost, previousPosts }
    },
    onError: (_, __, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', postId], context.previousPost)
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts)
      }
    },
  })
}

export function useCommentLikes(commentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      const response = await (isLiked
        ? api.posts.comments.like[':commentId'].$delete({ param: { commentId } })
        : api.posts.comments.like[':commentId'].$post({ param: { commentId } }))

      if (!response.ok)
        handleResponse(response)

      return response.json()
    },
    onMutate: async (isLiked) => {
      const queries = queryClient.getQueriesData({ queryKey: ['post-comments'] })
      const previousData = new Map()

      for (const [queryKey] of queries) {
        await queryClient.cancelQueries({ queryKey })
        const data = queryClient.getQueryData(queryKey)
        previousData.set(queryKey, data)

        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.pages)
            return old

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: page.items.map((comment: any) => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    hasLiked: !isLiked,
                    _count: {
                      ...comment._count,
                      likes: (comment._count?.likes ?? 0) + (isLiked ? -1 : 1),
                    },
                  }
                }
                return comment
              }),
            })),
          }
        })
      }

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData.entries()) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
  })
}

export function useExplorePosts() {
  const query = useQuery({
    queryKey: ['explore-posts'],
    queryFn: async () => {
      const response = await api.posts.explore.$get()

      if (response.ok)
        return response.json()
      return handleResponse(response)
    },
  })
  return query
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.posts.id[':id'].$delete({
        param: { id: postId },
      })

      if (!response.ok)
        handleResponse(response)

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { id: string, content: string, image?: File | null }) => {
      const response = await api.posts.id[':id'].$patch({
        param: { id: data.id },
        form: {
          content: data.content,
          ...(data.image && { image: data.image as File }),
        },
      })

      if (!response.ok)
        handleResponse(response)

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
    },

  })
}
