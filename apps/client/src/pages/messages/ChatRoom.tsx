import type { ChatRoom as ChatRoomType } from '@/types'
import { UserAvatar } from '@/components/PostElements'
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { useCurrentProfile } from '@/hooks/useProfile'
import { useChatMessages } from '@/pages/messages/hooks/useChat'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'wouter'
import { ChatRoomInput } from './ChatInput'

interface ChatRoomProps {
  selectedUser: ChatRoomType['participants'][0]
  onSendMessage: (content: string) => void
  onBack?: () => void
}

export function ChatRoom({ selectedUser, onSendMessage, onBack }: ChatRoomProps) {
  const { data: currentUser } = useCurrentProfile()
  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(selectedUser?.id ?? '')

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage)
      fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="border-b border-[#DBDBDB] p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1">
              <ArrowLeft className="size-5" />
            </button>
          )}
          <Link to={`/users/${selectedUser.username}`} className="inline-flex items-center gap-3">
            <UserAvatar
              withBorder={false}
              className="size-11 border border-black/10"
              fallbackClassName="cursor-pointer"
              url={selectedUser.avatarUrl}
              username={selectedUser.username}
            />
            <span className="font-semibold">{selectedUser.username}</span>
          </Link>
        </div>
      </div>

      <ChatMessageList
        className=""
        onScrollTop={handleLoadMore}
      >
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
        {messages.map(message => (
          <ChatBubble
            key={message.id}
            variant={message.senderId === currentUser?.id ? 'sent' : 'received'}
          >
            <UserAvatar
              withBorder={false}
              className="size-7 text-xs"
              url={message.sender.avatarUrl}
              username={message.sender.username}
            />
            <ChatBubbleMessage variant={message.senderId === currentUser?.id ? 'sent' : 'received'}>
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </ChatMessageList>

      <ChatRoomInput onSendMessage={onSendMessage} />
    </div>
  )
}
