import { useModal } from '@/contexts/ModalContext'
import { usePost } from '@/hooks/usePosts'
import { useProfile } from '@/hooks/useProfile'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { PostFormModal } from './PostFormModal'

export function PostEditModalContainer() {
  const [postEditId, setPostEditId] = useQueryState('postEditId')
  const { openModal } = useModal()
  const { data: post, isLoading: isPostLoading } = usePost(postEditId ?? '', !!postEditId)
  const { data: profile, isLoading: isProfileLoading } = useProfile(
    post?.author.username ?? '',
    !!postEditId,
  )

  useEffect(() => {
    if (!postEditId) {
      openModal(null)
      return
    }

    if (!post || !profile)
      return

    if (profile?.username !== post?.author.username) {
      setPostEditId(null)
      openModal(null)
      return
    }
    openModal('post-edit')
  }, [postEditId, post, profile])

  if (!postEditId || isPostLoading || !post || isProfileLoading || !profile)
    return null

  return (
    <PostFormModal
      trigger={false}
      open={true}
      onOpen={(open) => {
        if (!open) {
          setPostEditId(null)
          openModal(null)
        }
      }}
      mode="edit"
      initialData={{
        id: post.id,
        content: post.content ?? '',
        imageUrl: post.imageUrl,
      }}
    />
  )
}
