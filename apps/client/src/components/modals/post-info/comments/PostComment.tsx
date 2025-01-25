import type { PostComment as PostCommentT } from '@/types'
import { NotificationActiveIcon, NotificationIcon } from '@/assets/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCommentLikes } from '@/hooks/usePosts'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import { Link } from 'wouter'

interface PostCommentProps {
  comment: PostCommentT
}

export function PostComment({ comment }: PostCommentProps) {
  const { mutateAsync: toggleLike } = useCommentLikes(comment.id)
  const timeAgo = useTimeAgo(comment.createdAt)

  return (
    <div className="flex items-start gap-3">
      <Link to={`/users/${comment?.user?.username}`}>
        <Avatar className="size-8 border-2 border-white">
          <AvatarImage src={comment?.user?.avatarUrl ?? ''} />
          <AvatarFallback>
            {comment?.user?.username?.charAt(0).toUpperCase() ?? ''}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="mt-0.5 flex-1">
        <div className="flex items-start justify-between">
          <div className="whitespace-break-spaces text-xs/tight">
            <Link to={`/users/${comment?.user?.username}`} className="text-xs font-semibold">
              {comment?.user?.username ?? ''}
            </Link>
            {'  '}
            {comment?.content ?? ''}
          </div>
          <button
            className="ml-2 mr-1 mt-1.5 shrink-0"
            onClick={() => toggleLike(comment?.hasLiked)}
          >
            {comment?.hasLiked
              ? <NotificationActiveIcon className="size-3 text-[#262626]" />
              : <NotificationIcon className="size-3 text-[#262626]" />}
          </button>
        </div>
        <div className="mt-1.5 flex items-center gap-6 text-[10px]/tight">
          <span className="text-[#737373]">
            {timeAgo}
          </span>
          <span className="font-semibold text-[#737373]">
            Likes:
            {' '}
            {comment?._count?.likes?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
