import type { ChatRoom } from '@/types'
import { useIsMobile } from '@/hooks/use-mobile'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useParams } from 'wouter'
import { MessagesContainer } from './MessagesContainer'
import { useChatState } from '@/pages/messages/hooks/useChatState'

export function MessagesPage() {
  const { username } = useParams()
  const [, navigate] = useLocation()
  const queryClient = useQueryClient()
  const isMobile = useIsMobile(768)

  const {
    currentUser,
    rooms,
    isLoading,
    isSuccess,
    isError,
    selectedUser,
    setSelectedUser,
    sendMessage,
  } = useChatState(username)

  if (username === currentUser?.username)
    navigate('/messages', { replace: true })

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['chatMessages'] })
    }
  }, [queryClient])

  const handleSelectUser = (user: ChatRoom['participants'][0]) => {
    setSelectedUser(user)
    navigate(`/messages/${user.username}`)
  }

  const handleBack = () => {
    navigate('/messages')
    setSelectedUser(null)
  }

  if (isError)
    return <div className="flex size-full h-[83vh] items-center justify-center text-xl">Something went wrong, try again later</div>

  return (
    <MessagesContainer
      isLoading={isLoading}
      isSuccess={isSuccess}
      rooms={rooms}
      currentUser={currentUser}
      selectedUser={selectedUser}
      isMobile={isMobile}
      onSelectUser={handleSelectUser}
      onSendMessage={sendMessage}
      onBack={handleBack}
    />
  )
}
