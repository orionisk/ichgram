import type { ChatRoom } from '@/types'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { useCurrentProfile } from '../../../hooks/useProfile'
import { useChatRooms } from './useChat'
import { useChatRoomManagement } from './useChatRoomManagement'
import { useChatWebSocket } from './useChatWebSocket'

export function useChatState(username?: string) {
  const [, navigate] = useLocation()
  const [selectedUser, setSelectedUser] = useState<ChatRoom['participants'][0] | null>(null)
  const [isWsError, setIsWsError] = useState<boolean>(false)

  const { data: currentUser } = useCurrentProfile()

  const { data: rooms = [], isLoading, isSuccess, isError: isRoomsError } = useChatRooms()
  const { sendMessage, lastJsonMessage } = useChatWebSocket({
    onError: () => setIsWsError(true),
  })
  const { createChatRoom, handleMessage, handleMessageSent } = useChatRoomManagement(currentUser?.id)

  const isError = isRoomsError || isWsError

  if (username === currentUser?.username)
    navigate('/messages', { replace: true })

  useEffect(() => {
    if (!username || !currentUser?.id)
      return

    const room = rooms.find(room =>
      room.participants.some(p => p.username === username),
    )

    if (room) {
      const otherUser = room.participants.find(p => p.id !== currentUser.id)
      setSelectedUser(otherUser ?? null)
    }
    else {
      createChatRoom.mutate(username, {
        onSuccess: (room) => {
          if (!room || 'message' in room)
            return
          const otherUser = room.participants.find(p => p.id !== currentUser.id)
          setSelectedUser(otherUser ?? null)
        },
      })
    }
  }, [username, currentUser?.id, rooms])

  useEffect(() => {
    if (!lastJsonMessage)
      return

    switch (lastJsonMessage.type) {
      case 'new_message':
        handleMessage(lastJsonMessage.data)
        setIsWsError(false)
        break
      case 'message_sent':
        handleMessageSent(lastJsonMessage.data)
        setIsWsError(false)
        break
      case 'error':
        setIsWsError(true)
        break
    }
  }, [lastJsonMessage])

  return {
    currentUser,
    rooms,
    isLoading,
    isSuccess,
    isError,
    selectedUser,
    setSelectedUser,
    sendMessage,
  }
}
