import type { api } from '@/lib/api-client'
import type { InferResponseType } from '@ichgram/api-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import { cn } from '@/lib/utils'
import { Link } from 'wouter'

interface PostCaptionProps {
  user?: InferResponseType<typeof api.posts.id[':id']['$get'], 200>['author']
  caption: string
  createdAt?: string | Date
  className?: string
}

export function PostCaption({ user, caption, createdAt, className }: PostCaptionProps) {
  const timeAgo = useTimeAgo(createdAt)

  return (
    <div className={cn('mt-1 flex items-start gap-3', className)}>
      <Link to={`/users/${user?.username}`} className="rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 p-px">
        <Avatar className="size-8 border-2 border-white">
          <AvatarImage src={user?.avatarUrl ?? ''} />
          <AvatarFallback>
            {user?.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="mt-1 flex-1">
        <div className=" break-all text-xs/tight">
          <Link to={`/users/${user?.username}`} className="font-semibold">{user?.username}</Link>
          {'  '}
          {caption}
        </div>
        <div className="mt-1 text-[10px]/tight text-[#737373]">
          {timeAgo}
        </div>
      </div>
    </div>
  )
}
