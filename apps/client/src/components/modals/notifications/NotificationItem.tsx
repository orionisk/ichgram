import type { api } from '@/lib/api-client'
import type { InferResponseType } from '@ichgram/api-client'
import { UserAvatar } from '@/components/PostElements'
import { useModal } from '@/contexts/ModalContext'
import { useMarkAsRead } from '@/hooks/useNotifications'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import { cn } from '@/lib/utils'
import { useQueryState } from 'nuqs'
import { useEffect, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'wouter'

function getNotificationText(
  type: InferResponseType<typeof api.notification.$get, 200>['items'][number]['type'],
) {
  switch (type) {
    case 'like':
      return 'liked your photo.'
    case 'comment':
      return 'commented your photo.'
    case 'follow':
      return 'started following.'
  }
}

interface NotificationItemProps {
  notification: InferResponseType<typeof api.notification.$get, 200>['items'][number]
  onMarkAsRead?: () => void
}

export function NotificationItem({
  notification,
}: NotificationItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { mutate: markAsRead } = useMarkAsRead()
  const [, setPostId] = useQueryState('postId')
  const { openModal } = useModal()

  const timeAgo = useTimeAgo(notification.createdAt)

  useEffect(() => {
    if (!notification.read) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              markAsRead([notification.id])
              observer.disconnect()
            }
          })
        },
        { threshold: 0.5 },
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [notification.id, notification.read, markAsRead])

  const handlePostNavigate = async () => {
    if (notification.postId) {
      openModal(null)
      setTimeout(() => {
        setPostId(notification.postId)
      }, 100)
    }
  }

  return (

    <div
      ref={ref}
      onClick={notification.postId ? handlePostNavigate : undefined}
      className={cn(
        'flex items-center gap-4 rounded-lg py-2 pr-1 hover:bg-gray-50',
        !notification.read && 'bg-blue-50',
        notification.postId && 'cursor-pointer',
      )}
    >
      <Link
        href={`/users/${notification.fromUser.username}`}
        onClick={(e) => {
          e.stopPropagation()
          openModal(null)
        }}
      >
        <UserAvatar
          className="size-10 border-none"
          fallbackClassName="border border-black/50"
          withBorder={false}
          url={notification.fromUser.avatarUrl}
          username={notification.fromUser.username}
        />
      </Link>
      <div className="max-w-36 flex-1 text-sm/tight">
        <span className="font-semibold">{notification.fromUser.username}</span>
        {' '}
        <span className="">{getNotificationText(notification.type)}</span>
        <span className="whitespace-nowrap text-gray-500">
          {' '}
          {timeAgo}
        </span>
      </div>
      {notification.postId && (
        <LazyLoadImage
          src={notification.targetImage ?? ''}
          alt="Target content"
          width={44}
          height={44}
          className="ml-auto size-11 rounded-lg object-cover"
        />
      )}
    </div>
  )
}
