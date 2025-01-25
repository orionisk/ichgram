import type { ChatRoom } from '@/types'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ChatRoom as ChatRoomComponent } from './ChatRoom'
import { ChatSidebar } from './ChatSidebar'
import { EmptyChatState } from './EmptyChatState'

interface MessagesContainerProps {
  isLoading: boolean
  isSuccess: boolean
  rooms: ChatRoom[]
  currentUser: any
  selectedUser: ChatRoom['participants'][0] | null
  isMobile: boolean
  onSelectUser: (user: ChatRoom['participants'][0]) => void
  onSendMessage: (userId: string, content: string) => void
  onBack: () => void
}

export function MessagesContainer({
  isLoading,
  isSuccess,
  rooms,
  currentUser,
  selectedUser,
  isMobile,
  onSelectUser,
  onSendMessage,
  onBack,
}: MessagesContainerProps) {
  return (
    <div className={cn(
      'h-[83vh] border border-[#DBDBDB]',
      isMobile
        ? 'grid grid-rows-[1fr]'
        : 'grid grid-cols-[200px,1fr] lg:grid-cols-[300px,1fr] xl:grid-cols-[350px,1fr]',
    )}
    >
      {isLoading && (
        <div className="col-span-2 flex size-full items-center justify-center">
          <Loader2 className="size-12 animate-spin" />
        </div>
      )}
      {isSuccess && (
        <>
          {(!isMobile || !selectedUser) && (
            <ChatSidebar
              currentUser={currentUser}
              rooms={rooms}
              selectedUserId={selectedUser?.id}
              onSelectUser={onSelectUser}
            />
          )}

          {(!isMobile || selectedUser) && (
            selectedUser
              ? (
                  <ChatRoomComponent
                    selectedUser={selectedUser}
                    onSendMessage={content => onSendMessage(selectedUser.id, content)}
                    onBack={isMobile ? onBack : undefined}
                  />
                )
              : (
                  <EmptyChatState />
                )
          )}
        </>
      )}
    </div>
  )
}
