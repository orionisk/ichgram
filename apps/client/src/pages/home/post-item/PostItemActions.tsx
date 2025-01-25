import type { Post } from '@/types'
import { CommentIcon, NotificationActiveIcon, NotificationIcon } from '@/assets/icons/icons'
import { usePostLikes } from '@/hooks/usePosts'
import { useCurrentProfile } from '@/hooks/useProfile'
import { Link } from 'wouter'

interface PostItemActionsProps {
  postId: string
  isLiked: boolean
  author: Post['author']
}

export function PostItemActions({ postId, isLiked, author }: PostItemActionsProps) {
  const { mutateAsync: toggleLike } = usePostLikes(postId)
  const { data: profile } = useCurrentProfile()

  return (
    <div className="flex items-center justify-between pt-2.5">
      <div className="flex gap-3">
        {isLiked
          ? (
              <button onClick={() => toggleLike(true)}>
                <NotificationActiveIcon className="size-[22px]" />
              </button>
            )
          : (
              <button onClick={() => toggleLike(false)}>
                <NotificationIcon className="size-[22px]" />
              </button>
            )}
        {profile?.username !== author.username && (
          <Link to={`/messages/${author.username}`}>
            <CommentIcon className="size-[20px]" />
          </Link>
        )}
      </div>
    </div>
  )
}
