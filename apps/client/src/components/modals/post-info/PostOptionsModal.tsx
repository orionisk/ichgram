import { ThreeDotsIcon } from '@/assets/icons/icons'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useModal } from '@/contexts/ModalContext'
import { useDeletePost } from '@/hooks/usePosts'
import { cn } from '@/lib/utils'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

interface PostOptionsModalProps {
  postId: string
}

export function PostOptionsModal({
  postId,
}: PostOptionsModalProps) {
  const [, setPostIdParam] = useQueryState('postId')
  const [, setPostEditId] = useQueryState('postEditId')
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const { mutateAsync: deletePost, isPending } = useDeletePost()

  const handleDelete = async () => {
    await deletePost(postId)
    setIsOpen(false)
    openModal(null)
    setPostIdParam(null)
  }

  const handleEdit = () => {
    setIsOpen(false)
    setPostEditId(postId)
    setPostIdParam(null)
    openModal('post-edit')
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${window.location.search}`
    navigator.clipboard.writeText(url)
    setIsOpen(false)
  }

  const menuItems = [
    { label: isPending ? 'Deleting...' : 'Delete', onClick: handleDelete, className: 'text-red-500 font-bold' },
    { label: 'Edit', onClick: handleEdit },
    { label: 'Copy link', onClick: handleCopyLink },
    { label: 'Cancel', onClick: () => setIsOpen(false) },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="ml-auto rounded-full p-1 transition-colors hover:bg-black/5"
          aria-label="Post options"
        >
          <ThreeDotsIcon className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[400px] max-w-[95vw] p-0">
        <DialogTitle className="sr-only">Post options</DialogTitle>
        <DialogDescription className="sr-only">Post options</DialogDescription>
        <div className="flex flex-col divide-y divide-[#DBDBDB]">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn('w-full py-3.5 text-sm transition-colors hover:bg-gray-50', item.className)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
