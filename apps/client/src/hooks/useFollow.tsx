import { api } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useFollow(username: string) {
  const queryClient = useQueryClient()

  const follow = useMutation({
    mutationFn: () => api.user.follow[':username'].$post({
      param: { username },
    }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', username] })
      await queryClient.cancelQueries({ queryKey: ['profile', username] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      const previousUser = queryClient.getQueryData(['user', username])
      const previousProfile = queryClient.getQueryData(['profile', username])
      const previousPosts = queryClient.getQueryData(['posts'])

      queryClient.setQueryData(['user', username], (old: any) => ({
        ...old,
        isFollowing: true,
        _count: {
          ...old?._count,
          followers: (old?._count?.followers ?? 0) + 1,
        },
      }))

      queryClient.setQueryData(['profile', username], (old: any) => ({
        ...old,
        isFollowing: true,
        _count: {
          ...old?._count,
          followers: (old?._count?.followers ?? 0) + 1,
        },
      }))

      queryClient.setQueryData(['posts'], (old: any) => ({
        ...old,
        pages: old?.pages?.map((page: any) => ({
          ...page,
          items: page.items.map((post: any) => {
            if (post.author.username === username) {
              return {
                ...post,
                author: {
                  ...post.author,
                  isFollowing: true,
                },
              }
            }
            return post
          }),
        })),
      }))

      return { previousUser, previousProfile, previousPosts }
    },
    onError: (_, __, context) => {
      if (context?.previousUser)
        queryClient.setQueryData(['user', username], context.previousUser)
      if (context?.previousProfile)
        queryClient.setQueryData(['profile', username], context.previousProfile)
      if (context?.previousPosts)
        queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })

  const unfollow = useMutation({
    mutationFn: () => api.user.follow[':username'].$delete({
      param: { username },
    }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', username] })
      await queryClient.cancelQueries({ queryKey: ['profile', username] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      const previousUser = queryClient.getQueryData(['user', username])
      const previousProfile = queryClient.getQueryData(['profile', username])
      const previousPosts = queryClient.getQueryData(['posts'])

      queryClient.setQueryData(['user', username], (old: any) => ({
        ...old,
        isFollowing: false,
        _count: {
          ...old?._count,
          followers: Math.max(0, (old?._count?.followers ?? 1) - 1),
        },
      }))

      queryClient.setQueryData(['profile', username], (old: any) => ({
        ...old,
        isFollowing: false,
        _count: {
          ...old?._count,
          followers: Math.max(0, (old?._count?.followers ?? 1) - 1),
        },
      }))

      queryClient.setQueryData(['posts'], (old: any) => ({
        ...old,
        pages: old?.pages?.map((page: any) => ({
          ...page,
          items: page.items.map((post: any) => {
            if (post.author.username === username) {
              return {
                ...post,
                author: {
                  ...post.author,
                  isFollowing: false,
                },
              }
            }
            return post
          }),
        })),
      }))

      return { previousUser, previousProfile, previousPosts }
    },
    onError: (_, __, context) => {
      if (context?.previousUser)
        queryClient.setQueryData(['user', username], context.previousUser)
      if (context?.previousProfile)
        queryClient.setQueryData(['profile', username], context.previousProfile)
      if (context?.previousPosts)
        queryClient.setQueryData(['posts'], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })

  return {
    follow,
    unfollow,
    isLoading: follow.isPending || unfollow.isPending,
  }
}
