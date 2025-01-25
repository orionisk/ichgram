import type { ChatMessage } from '@/types'
import { api } from '@/lib/api-client'
import { getToken } from '@/lib/getToken'
import { useCallback } from 'react'
import useWebSocket from 'react-use-websocket'

export function useChatWebSocket({ onError }: { onError: () => void }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{ type: string, data: ChatMessage }>(
    api.chat.ws.$url().toString(),
    {
      queryParams: { token: getToken() ?? '' },
      shouldReconnect: () => true,
      onError,
    },
  )

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!content.trim())
      return

    sendJsonMessage({
      type: 'message',
      receiverId,
      content: content.trim(),
    })
  }, [sendJsonMessage])

  return {
    sendMessage,
    lastJsonMessage,
  }
}
