import { useModal } from '@/contexts/ModalContext'
import { usePost } from '@/hooks/usePosts'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { PostInfoModal } from './PostInfoModal'

export function PostModalContainer() {
  const [postId] = useQueryState('postId')
  const query = usePost(postId ?? '', !!postId)
  const { openModal } = useModal()

  useEffect(() => {
    if (postId) {
      setTimeout(() => {
        openModal('post-info')
      }, 100)
    }
    else {
      openModal(null)
    }
  }, [postId, query.data])

  if (!postId)
    return null

  return (
    <PostInfoModal
      postQuery={query}
      isOpen={!!postId}
    />
  )
}
