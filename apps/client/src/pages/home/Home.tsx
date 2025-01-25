import allUpdates from '@/assets/all-updates.png'
import { usePosts } from '@/hooks/usePosts'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostItems } from './post-item/PostItems'

export function Home() {
  const { ref, inView } = useInView()
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePosts()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const allPosts = data?.pages.flatMap(page => page.items) ?? []
  const showEndMessage = !hasNextPage && allPosts.length > 0

  if (isLoading)
    return <div className="flex h-[80vh] items-center justify-center text-xl"><Loader2 className="size-12 animate-spin" /></div>

  if (allPosts.length === 0) {
    return <div className="flex h-[80vh] items-center justify-center text-xl">No posts yet</div>
  }

  return (
    <div className="px-5 py-3 lg:px-10 lg:py-6 xl:px-20 xl:py-12">
      <div className="max-w-[846px]">
        {allPosts.length > 0 && <PostItems posts={allPosts} />}

        {isFetchingNextPage && (
          <div className="mt-5 flex justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}

        <div ref={ref} className="h-10" />

        {showEndMessage && (
          <div className="mt-10 flex flex-col items-center">
            <img src={allUpdates} alt="all updates" />
            <div className="mt-2 text-base">You've seen all the updates</div>
            <div className="text-xs text-[#737373]">
              You have viewed all new publications
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
