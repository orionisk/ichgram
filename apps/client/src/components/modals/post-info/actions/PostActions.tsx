import type { Post } from '@/types'
import { CommentIcon, NotificationActiveIcon, NotificationIcon } from '@/assets/icons/icons'
import { ActionButton } from '@/components/PostElements'
import { usePostLikes } from '@/hooks/usePosts'
import { useCurrentProfile } from '@/hooks/useProfile'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import { Link } from 'wouter'
import { PostCommentAction } from './PostCommentAction'

interface PostActionsProps {
  likes: number
  postId: string
  isLiked: boolean
  createdAt?: string | Date
  author: Post['author']
}

export function PostActions({ likes, postId, isLiked, createdAt, author }: PostActionsProps) {
  const { data: currentUser } = useCurrentProfile()
  const timeAgo = useTimeAgo(createdAt)
  const { mutateAsync: toggleLike } = usePostLikes(postId)

  return (
    <div className="mt-auto">
      <div className="border-t border-[#DBDBDB] pt-3.5">
        <div className="items-center justify-between gap-5 px-3 max-md:flex">
          <div className="flex gap-3">
            <ActionButton onClick={() => toggleLike(isLiked)}>
              {isLiked
                ? <NotificationActiveIcon className="size-5" />
                : <NotificationIcon className="size-5" />}
            </ActionButton>
            {currentUser?.username !== author?.username && (
              <Link to={`/messages/${author?.username}`}>
                <CommentIcon className="size-5" />
              </Link>
            )}
          </div>

          <div className="items-center max-lg:flex max-lg:gap-3 md:mt-3 lg:space-y-1">
            <p className="text-xs font-semibold">
              {likes?.toLocaleString()}
              {' '}
              likes
            </p>
            {createdAt && (
              <p className="text-[10px] text-[#737373]">
                {timeAgo}
              </p>
            )}
          </div>
        </div>
      </div>

      <PostCommentAction postId={postId} />
    </div>
  )
}
