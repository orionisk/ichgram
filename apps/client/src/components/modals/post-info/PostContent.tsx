import type { Post } from '@/types'
import { LazyImage } from '@/components/LazyImage'
import { usePostComments } from '@/hooks/usePosts'
import { useProfile } from '@/hooks/useProfile'
import { useSearch } from 'wouter'
import { PostActions } from './actions/PostActions'
import { PostCommentsList } from './comments/PostCommentsList'
import { PostCaption } from './PostCaption'
import { PostHeader } from './PostHeader'

interface PostContentProps {
  post: Post
  isOpen: boolean
}

export function PostContent({ post, isOpen }: PostContentProps) {
  const params = useSearch()
  const postId = new URLSearchParams(params).get('postId') ?? post?.id ?? ''
  const { data: profile } = useProfile(post?.author?.username ?? '')
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostComments(postId, isOpen)

  const allComments = comments?.pages.flatMap(page => page.items) ?? []

  return (
    <div className="grid h-[664px] grid-cols-1 lg:grid-cols-2 xl:h-[722px] xl:grid-cols-[1.365fr,1fr]">
      {/* Left side - Image */}
      <LazyImage
        src={post?.imageUrl}
        wrapperClassName="relative flex items-center justify-center bg-white overflow-hidden"
        imageClassName="size-full object-contain"
        loaderClassName="size-full text-neutral-400"
        className="overflow-hidden max-lg:h-[300px]"
        alt={`Post by ${profile?.username}`}
        visibleByDefault
      />

      {/* Right side - Info */}
      <div className="flex flex-col border-l border-[#DBDBDB] bg-white">
        <PostHeader user={profile} postId={postId} />

        <div className="flex max-h-[calc(400px-200px)] flex-1 flex-col gap-5 p-2 pr-3 lg:max-h-[calc(622px-200px)] xl:max-h-[calc(722px-200px)]">
          {post?.content && (
            <PostCaption
              user={post?.author}
              caption={post.content}
              createdAt={post?.createdAt}
            />
          )}
          <PostCommentsList
            comments={allComments}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>

        <PostActions
          author={post?.author}
          likes={post?._count?.likes ?? 0}
          postId={postId}
          isLiked={post?.isLiked ?? false}
          createdAt={post?.createdAt}
        />
      </div>
    </div>
  )
}
