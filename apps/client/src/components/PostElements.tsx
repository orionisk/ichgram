import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  url?: string | null
  username?: string
  className?: string
  withBorder?: boolean
  fallbackClassName?: string
  onClick?: () => void
}

export function UserAvatar({
  url,
  username,
  className,
  withBorder = true,
  fallbackClassName,
  onClick,
}: UserAvatarProps) {
  const avatar = (
    <Avatar
      className={cn('size-8', 'border border-black/10', className)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <AvatarImage src={url ?? undefined} />
      <AvatarFallback className={cn(fallbackClassName)}>
        {username?.charAt(0).toUpperCase() ?? ''}
      </AvatarFallback>
    </Avatar>
  )

  if (!withBorder) {
    return avatar
  }

  return (
    <div className="rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 p-px">
      {avatar}
    </div>
  )
}

export function ActionButton({ children, onClick, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'transition-colors hover:text-neutral-600',
        className,
      )}
    >
      {children}
    </button>
  )
}
