import type { Posts } from '@/types'
import type { LazyComponentProps } from 'react-lazy-load-image-component'
import { LazyImage } from '@/components/LazyImage'
import { Card } from '@/components/ui/card'
import { useQueryState } from 'nuqs'
import { PostItemActions } from './PostItemActions'
import { PostItemHeader } from './PostItemHeader'
import { PostItemInfo } from './PostItemInfo'

interface PostItemProps {
  post?: Posts[number]
}

export function PostItem({ post, scrollPosition }: PostItemProps & LazyComponentProps) {
  const [, setPostId] = useQueryState('postId')

  if (!post)
    return null

  return (
    <Card className="mx-auto w-[min(300px,100%)] rounded-none border-b border-[#DBDBDB] pb-4 sm:w-full lg:pb-8">
      <PostItemHeader
        author={post.author}
        createdAt={post.createdAt}
      />

      <button
        onClick={() => setPostId(post.id)}
        className="mt-2 block aspect-square w-full overflow-hidden"
      >
        <LazyImage
          threshold={2000}
          scrollPosition={scrollPosition}
          src={post.imageUrl}
          alt={`Post by ${post.author.username}`}
          className="size-full"
          imageClassName="object-top"
          loaderClassName="absolute inset-0 size-full"
        />
      </button>

      <PostItemActions
        postId={post.id}
        isLiked={post.isLiked ?? false}
        author={post.author}
      />

      <PostItemInfo
        postId={post.id}
        likes={post._count?.likes ?? 0}
        comments={post._count?.comments ?? 0}
        author={post.author}
        content={post.content}
      />
    </Card>
  )
}
