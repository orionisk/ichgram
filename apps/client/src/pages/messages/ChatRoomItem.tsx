import type { ChatRoom } from '@/types'
import { UserAvatar } from '@/components/PostElements'
import { useTimeAgo } from '@/hooks/useTimeAgo'

interface ChatRoomItemProps {
  room: ChatRoom
  otherUser: ChatRoom['participants'][0]
  isSelected: boolean
  onSelect: (user: ChatRoom['participants'][0]) => void
}

export function ChatRoomItem({ room, otherUser, isSelected, onSelect }: ChatRoomItemProps) {
  const timeAgo = useTimeAgo(room.lastMessage?.createdAt)

  return (
    <button
      className={`flex w-full items-center gap-1.5 p-2 hover:bg-gray-50 lg:gap-3 lg:p-4 ${
        isSelected ? 'bg-gray-100' : ''
      }`}
      onClick={() => onSelect(otherUser)}
    >
      {otherUser.avatarUrl && (
        <img
          className="size-10 rounded-full border-black/10 lg:size-14"
          src={otherUser.avatarUrl}
          alt={otherUser.username}
        />
      )}
      {!otherUser.avatarUrl && (
        <UserAvatar
          className="size-10 border-black/10 lg:size-14"
          withBorder={false}
          url={otherUser.avatarUrl}
          username={otherUser.username}
        />
      )}
      <div className="flex-1 text-left">
        <div className="font-semibold">{otherUser.username}</div>
        {room.lastMessage && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="max-w-44 truncate max-xl:md:max-w-24 xl:max-w-[200px]">{room.lastMessage.content.slice(0, 30)}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        )}
      </div>
    </button>
  )
}
