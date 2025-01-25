import { Button } from '@/components/ui/button'
import { useAutoScroll } from '@/components/ui/chat/hooks/useAutoScroll'
import { ArrowDown } from 'lucide-react'
import * as React from 'react'
import { useCallback } from 'react'

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean
  onScrollTop?: () => void
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, onScrollTop, ...props }, _ref) => {
    const {
      scrollRef,
      isAtBottom,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth,
      content: children,
    })

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget
      const threshold = 150 // pixels before top
      if (element.scrollTop <= threshold && onScrollTop) {
        onScrollTop()
      }
    }, [onScrollTop])

    return (
      <div className="relative size-full overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <div
          className={`flex size-full flex-col overflow-y-auto p-4 ${className}`}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          onScroll={handleScroll}
          {...props}
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>
    )
  },
)

ChatMessageList.displayName = 'ChatMessageList'

export { ChatMessageList }
