import { NotificationActiveIcon, NotificationIcon } from '@/assets/icons/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useNotifications, useUnreadNotificationsCount } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import { NotificationItem } from './NotificationItem'

export function NotificationsModal({
  open,
  onOpen,
  label,
}: {
  open: boolean
  onOpen: (open: boolean) => void
  label: string
}) {
  useEscapeKey(open, () => onOpen(false))
  const { data: unreadCount } = useUnreadNotificationsCount()

  const { data: notifications, refetch } = useNotifications()

  useEffect(() => {
    if (open)
      refetch()
  }, [open, refetch])

  return (
    <Sheet modal={false} open={open}>
      <SheetTrigger
        className="relative flex w-full items-center gap-2 p-2 hover:bg-gray-100 lg:gap-4"
        onClick={() => onOpen(!open)}
      >
        {open
          ? (
              <NotificationActiveIcon className="size-5 lg:size-6" />
            )
          : (
              <NotificationIcon className="size-5 lg:size-6" />
            )}
        {!open && unreadCount && unreadCount.count > 0 && (
          <span className={cn(
            'absolute left-5 -top-1.5 flex size-4 md:size-5 items-center justify-center',
            'rounded-full bg-red-500 text-[9px] md:text-[10px] font-medium text-white',
          )}
          >
            {unreadCount.count > 99 ? '99+' : unreadCount.count}
          </span>
        )}
        <span className="max-sm:hidden">{label}</span>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-r-2xl p-3 shadow-[4px_0px_24px_rgba(0,0,0,0.15)] sm:px-6 sm:py-5">
        <SheetClose asChild className="absolute right-3 top-2 sm:hidden">
          <button onClick={() => onOpen(false)}>
            <XIcon className="size-6" />
          </button>
        </SheetClose>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold sm:text-2xl">Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            Notifications
          </SheetDescription>
        </SheetHeader>
        {notifications?.items?.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
        <div className="mt-2 flex flex-col gap-3.5 sm:mt-3">
          <ScrollArea className="flex max-h-[calc(100vh-50px)] flex-col">
            {notifications?.items?.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
