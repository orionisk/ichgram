import type { ChatMessage, ChatRoom } from '@/types'
import type { InferResponseType } from '@ichgram/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useLocation } from 'wouter'

export function useChatRoomManagement(currentUserId?: string) {
  const queryClient = useQueryClient()
  const [, navigate] = useLocation()

  const createChatRoom = useMutation({
    mutationFn: async (participantUsername: string) => {
      const userResponse = await api.user[':username'].profile.$get({
        param: { username: participantUsername },
      })
      const user = await userResponse.json()
      if (!user || 'message' in user) {
        navigate('/messages', { replace: true })
        return null
      }

      const res = await api.chat.rooms.$post({
        json: {
          participantId: user.id,
        },
      })
      const data = await res.json()
      if ('error' in data)
        return null
      return data
    },
  })

  const handleMessage = useCallback((message: ChatMessage) => {
    queryClient.setQueryData(
      ['chatMessages', message.senderId === currentUserId ? message.receiverId : message.senderId],
      (oldData: InfiniteData<InferResponseType<typeof api.chat.history[':userId']['$get'], 200>> | undefined) => {
        if (!oldData?.pages?.[0])
          return oldData

        const messageExists = oldData.pages.some(page =>
          page.items.some(m => m.id === message.id),
        )
        if (messageExists)
          return oldData

        const newPages = [...oldData.pages]
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
          pagination: {
            ...newPages[0].pagination,
            total: newPages[0].pagination.total + 1,
          },
        }
        return { ...oldData, pages: newPages }
      },
    )

    queryClient.setQueryData(['chatRooms'], (oldRooms: ChatRoom[] = []) => {
      const roomExists = oldRooms.some(room =>
        room.participants.some(p => p.id === message.senderId)
        && room.participants.some(p => p.id === message.receiverId),
      )

      if (roomExists) {
        return oldRooms.map((room) => {
          const isRoomParticipant = room.participants.some(p =>
            p.id === message.senderId || p.id === message.receiverId,
          )

          const containsBothParticipants = room.participants.some(p => p.id === message.senderId)
            && room.participants.some(p => p.id === message.receiverId)

          if (!isRoomParticipant || !containsBothParticipants)
            return room

          return {
            ...room,
            lastMessage: message,
            updatedAt: message.createdAt,
          }
        }).sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
      }

      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
      return oldRooms
    })
  }, [currentUserId, queryClient])

  const handleMessageSent = useCallback((message: ChatMessage) => {
    queryClient.setQueryData(
      ['chatMessages', message.receiverId],
      (oldData: InfiniteData<InferResponseType<typeof api.chat.history[':userId']['$get'], 200>> | undefined) => {
        if (!oldData?.pages?.[0])
          return oldData

        const messageExists = oldData.pages.some(page =>
          page.items.some((m: ChatMessage) => m.id === message.id),
        )
        if (messageExists)
          return oldData

        const newPages = [...oldData.pages]
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items],
          pagination: {
            ...newPages[0].pagination,
            total: newPages[0].pagination.total + 1,
          },
        }
        return { ...oldData, pages: newPages }
      },
    )

    queryClient.setQueryData(['chatRooms'], (oldRooms: ChatRoom[] = []) => {
      const roomExists = oldRooms.some(room =>
        room.participants.some(p => p.id === message.senderId)
        && room.participants.some(p => p.id === message.receiverId),
      )

      if (roomExists) {
        return oldRooms.map((room) => {
          const isRoomParticipant = room.participants.some(p =>
            p.id === message.senderId || p.id === message.receiverId,
          )

          const containsBothParticipants = room.participants.some(p => p.id === message.senderId)
            && room.participants.some(p => p.id === message.receiverId)

          if (!isRoomParticipant || !containsBothParticipants)
            return room

          return {
            ...room,
            lastMessage: message,
            updatedAt: message.createdAt,
          }
        }).sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
      }

      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
      return oldRooms
    })
  }, [queryClient])

  return {
    createChatRoom,
    handleMessage,
    handleMessageSent,
  }
}
