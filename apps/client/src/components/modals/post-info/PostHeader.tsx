import type { api } from '@/lib/api-client'
import type { InferResponseType } from '@ichgram/api-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFollow } from '@/hooks/useFollow'
import { useCurrentProfile } from '@/hooks/useProfile'
import { Link } from 'wouter'
import { PostOptionsModal } from './PostOptionsModal'

interface PostHeaderProps {
  user?: InferResponseType<typeof api.user[':username']['profile']['$get'], 200>
  postId: string
}

export function PostHeader({ user, postId }: PostHeaderProps) {
  const { data: currentUser } = useCurrentProfile()
  const { follow, unfollow } = useFollow(user?.username ?? '')

  return (
    <div className="flex items-center gap-2.5 border-b border-[#EFEFEF] p-2">
      <Link to={`/users/${user?.username}`} className="rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 p-px">
        <Avatar className="size-8 border-2 border-white">
          <AvatarImage src={user?.avatarUrl ?? undefined} />
          <AvatarFallback>
            {user?.username.charAt(0).toUpperCase() ?? ''}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-1 items-center gap-2">
        <Link to={`/users/${user?.username}`} className="text-xs font-semibold">{user?.username ?? ''}</Link>
        {currentUser?.username !== user?.username && (
          <>
            <span className="text-sm text-[#737373]" aria-hidden="true">•</span>
            {user?.isFollowing
              ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#0095F6] transition-colors hover:text-[#00376B]"
                    aria-label={`Unfollow ${user?.username}`}
                    onClick={() => {
                      unfollow.mutateAsync()
                    }}
                  >
                    Unfollow
                  </button>
                )
              : (
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#0095F6] transition-colors hover:text-[#00376B]"
                    aria-label={`Follow ${user?.username}`}
                    onClick={() => {
                      follow.mutateAsync()
                    }}
                  >
                    Follow
                  </button>
                )}
          </>
        )}
      </div>
      {currentUser?.username === user?.username && (
        <PostOptionsModal
          postId={postId}
        />
      )}
    </div>
  )
}
