import type { PostComments } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { PostComment } from './PostComment'

interface CommentsListProps {
  comments: PostComments
  fetchNextPage: () => void
  hasNextPage?: boolean
  isFetchingNextPage: boolean
}

export function PostCommentsList({ comments, fetchNextPage, hasNextPage, isFetchingNextPage }: CommentsListProps) {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <ScrollArea>
      <div className="flex flex-col gap-5">
        {comments?.map(comment => (
          <PostComment key={comment.id} comment={comment} />
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        <div ref={ref} className="h-10" />
      </div>
    </ScrollArea>
  )
}
