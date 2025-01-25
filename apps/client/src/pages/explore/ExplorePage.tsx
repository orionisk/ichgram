import { ImagesMasonry } from '@/components/ImagesMasonry'
import { useExplorePosts } from '@/hooks/usePosts'
import { Loader2 } from 'lucide-react'
import { useQueryState } from 'nuqs'

export function ExplorePage() {
  const { data: posts, isLoading } = useExplorePosts()
  const [, setPostId] = useQueryState('postId')

  if (isLoading || !posts) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="flex h-[80vh] items-center justify-center text-xl">No posts yet</div>
  }

  return (
    <div className="p-2 sm:px-5 sm:py-3 lg:px-10 lg:py-6 xl:px-20 xl:py-12">
      <div className="max-w-[960px] pt-2 sm:pt-4 xl:pt-5">
        <ImagesMasonry
          items={posts}
          render={(post, idx) => (
            <button
              className="w-full"
              onClick={() => setPostId(post.id)}
            >
              <img
                src={post.imageUrl}
                alt={`Gallery image ${idx + 1}`}
                className="mx-auto h-auto w-[min(100%,300px)] sm:w-full"
                loading="lazy"
              />
            </button>
          )}
        />
      </div>
    </div>
  )
}
