import type { ButtonProps } from '../button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { Button } from '../button'
import MessageLoading from './message-loading'

const chatBubbleVariant = cva(
  'group relative flex max-w-[60%] items-end gap-2',
  {
    variants: {
      variant: {
        received: 'self-start',
        sent: 'flex-row-reverse self-end',
      },
      layout: {
        default: 'items-start',
      },
    },
    defaultVariants: {
      variant: 'received',
      layout: 'default',
    },
  },
)

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        'relative group',
      )}
      ref={ref}
      {...props}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child) && typeof child.type !== 'string'
          ? React.cloneElement(child, {
              variant,
              layout,
            } as React.ComponentProps<typeof child.type>)
          : child)}
    </div>
  ),
)
ChatBubble.displayName = 'ChatBubble'

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  className,
}) => (
  <Avatar className={className}>
    <AvatarImage src={src} alt="Avatar" />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
)

const chatBubbleMessageVariants = cva('p-4', {
  variants: {
    variant: {
      received: 'rounded-lg bg-[#EFEFEF] text-black',
      sent: 'rounded-lg bg-[#4D00FF] text-white',
    },
    layout: {
      default: '',
      ai: 'w-full rounded-none border-t bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'received',
    layout: 'default',
  },
})

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref,
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        'break-words max-w-full whitespace-pre-wrap',
      )}
      ref={ref}
      {...props}
    >
      {isLoading
        ? (
            <div className="flex items-center space-x-2">
              <MessageLoading />
            </div>
          )
        : (
            children
          )}
    </div>
  ),
)
ChatBubbleMessage.displayName = 'ChatBubbleMessage'

interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn('text-xs mt-2 text-right', className)} {...props}>
    {timestamp}
  </div>
)

type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode
}

const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={className}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
)

interface ChatBubbleActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received'
  className?: string
}

const ChatBubbleActionWrapper = React.forwardRef<
  HTMLDivElement,
  ChatBubbleActionWrapperProps
>(({ variant, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200',
      variant === 'sent'
        ? '-left-1 -translate-x-full flex-row-reverse'
        : '-right-1 translate-x-full',
      className,
    )}
    {...props}
  >
    {children}
  </div>
))
ChatBubbleActionWrapper.displayName = 'ChatBubbleActionWrapper'

export {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  chatBubbleMessageVariants,
  ChatBubbleTimestamp,
  chatBubbleVariant,
}
