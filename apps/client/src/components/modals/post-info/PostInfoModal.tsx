import type { api } from '@/lib/api-client'
import type { InferResponseType } from '@ichgram/api-client'
import type { UseQueryResult } from '@tanstack/react-query'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useModal } from '@/contexts/ModalContext'
import { Loader2, XIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { PostContent } from './PostContent'

interface PostInfoModalProps {
  postQuery: UseQueryResult<InferResponseType<typeof api.posts.id[':id']['$get'], 200>>
  isOpen: boolean
}

export function PostInfoModal({ postQuery, isOpen }: PostInfoModalProps) {
  const [, setPostId] = useQueryState('postId')
  const { openModal } = useModal()
  const { isSuccess, isLoading, isError, data: post, error } = postQuery

  const handleClose = () => {
    setPostId(null)
    openModal(null)
  }

  return (
    <Sheet
      modal={false}
      open={isOpen}
      onOpenChange={() => handleClose()}
    >
      <SheetContent className="fixed left-1/2 top-1/2 h-[664px] max-h-screen max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm p-0 focus-visible:outline-none sm:left-[calc(50%+var(--sidebar-width)/2)] sm:max-w-screen-md lg:w-full xl:h-[722px] xl:max-w-[1000px]">
        {isLoading && (
          <div className="flex size-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-neutral-400" />
            <SheetTitle className="sr-only">Post info</SheetTitle>
            <SheetDescription className="sr-only">Post info</SheetDescription>
          </div>
        )}
        {isError && (
          <div className="flex size-full items-center justify-center">{error?.message}</div>
        )}
        {isSuccess && (
          <div className="size-full">
            <SheetClose asChild className="absolute right-3 top-2 z-10 sm:hidden">
              <button onClick={() => handleClose()}>
                <XIcon className="size-6" />
              </button>
            </SheetClose>
            <SheetHeader className="sr-only">
              <SheetTitle>Post info</SheetTitle>
              <SheetDescription className="sr-only">Post info</SheetDescription>
            </SheetHeader>
            <PostContent post={post} isOpen={isOpen} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
