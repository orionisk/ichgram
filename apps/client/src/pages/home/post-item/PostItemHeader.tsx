import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFollow } from '@/hooks/useFollow'
import { useCurrentProfile } from '@/hooks/useProfile'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import { Link } from 'wouter'

interface PostHeaderProps {
  author: {
    username: string
    avatarUrl: string | null
    isFollowing?: boolean
  }
  createdAt: string
}

export function PostItemHeader({ author, createdAt }: PostHeaderProps) {
  const timeAgo = useTimeAgo(createdAt)
  const { data: user } = useCurrentProfile()
  const { follow, unfollow } = useFollow(author.username)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-1">
        <Link
          to={`/users/${author.username}`}
          className="rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 p-[2px]"
        >
          <Avatar className="size-8 border-2 border-white">
            <AvatarImage src={author.avatarUrl ?? undefined} />
            <AvatarFallback>
              {author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="mt-0.5 flex items-center gap-1">
          <Link to={`/users/${author.username}`} className="ml-0.5 text-xs font-semibold">{author.username}</Link>
          <span className="text-xs text-[#737373]">
            •
            {' '}
            {timeAgo}
            {' '}
            •
          </span>
          {author.username !== user?.username && (
            author.isFollowing
              ? (
                  <button
                    className="ml-5 text-xs text-[#0095F6]"
                    onClick={() => unfollow.mutateAsync()}
                  >
                    unfollow
                  </button>
                )
              : (
                  <button
                    className="ml-5 text-xs text-[#0095F6]"
                    onClick={() => follow.mutateAsync()}
                  >
                    follow
                  </button>
                )
          )}
        </div>
      </div>
    </div>
  )
}
