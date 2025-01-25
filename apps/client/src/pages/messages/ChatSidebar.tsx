import type { ChatRoom } from '@/types'
import { ChatRoomItem } from './ChatRoomItem'

interface ChatSidebarProps {
  currentUser: { id: string, username: string }
  rooms: ChatRoom[]
  selectedUserId?: string
  onSelectUser: (user: ChatRoom['participants'][0]) => void
}

export function ChatSidebar({ currentUser, rooms, selectedUserId, onSelectUser }: ChatSidebarProps) {
  return (
    <div className="border-r border-[#DBDBDB]">
      <div className="p-2 lg:p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold lg:text-xl">{currentUser.username}</h1>
        </div>
      </div>

      <div className="overflow-auto">
        {rooms?.map((room) => {
          const otherUser = room.participants.find(p => p.id !== currentUser.id)
          if (!otherUser)
            return null

          return (
            <ChatRoomItem
              key={room.id}
              room={room}
              otherUser={otherUser}
              isSelected={selectedUserId === otherUser.id}
              onSelect={onSelectUser}
            />
          )
        })}
      </div>
    </div>
  )
}
