import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface ChatRoomInputProps {
  onSendMessage: (content: string) => void
}

export function ChatRoomInput({ onSendMessage }: ChatRoomInputProps) {
  const [messageInput, setMessageInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim())
      return

    onSendMessage(messageInput.trim())
    setMessageInput('')
  }

  return (
    <div className="sticky bottom-0 border-t border-[#DBDBDB] bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <Input
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          placeholder="Write message..."
          className="rounded-full bg-[#F3F3F3]"
        />
      </form>
    </div>
  )
}
