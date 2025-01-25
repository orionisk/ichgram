import type { Profile } from '@/hooks/useProfile'
import type { ModalType } from '@/types'
import { NotificationsModal } from '@/components/modals/notifications/NotificationsModal'
import { PostFormModal } from '@/components/modals/post/PostFormModal'
import { SearchModal } from '@/components/modals/search/SearchModal'
import { UserAvatar } from '@/components/PostElements'
import { navItems } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import { Link } from 'wouter'

interface MobileNavProps {
  location: string
  activeModal: ModalType
  onOpenSheet: (modalType: ModalType, isOpen: boolean) => void
  profile: Profile | null
}

export function MobileNav({ location, activeModal, onOpenSheet, profile }: MobileNavProps) {
  return (
    <div className="relative isolation-auto z-[9999]">
      <nav className="fixed inset-x-0 bottom-0 border-t border-[#DBDBDB] bg-white px-2 py-3">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            if (item.to === '/notifications') {
              return (
                <li key={item.to}>
                  <NotificationsModal
                    open={activeModal === 'notifications'}
                    onOpen={isOpen => onOpenSheet('notifications', isOpen)}
                    label=""
                  />
                </li>
              )
            }

            if (item.to === '/search') {
              return (
                <li key={item.to}>
                  <SearchModal
                    open={activeModal === 'search'}
                    onOpen={isOpen => onOpenSheet('search', isOpen)}
                    label=""
                  />
                </li>
              )
            }

            if (item.to === '/create') {
              return (
                <li key={item.to}>
                  <PostFormModal
                    open={activeModal === 'create'}
                    onOpen={isOpen => onOpenSheet('create', isOpen)}
                    mode="create"
                  />
                </li>
              )
            }

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => onOpenSheet(null, false)}
                  className={cn(
                    'flex items-center justify-center p-1 xs:p-2',
                    location === item.to && 'text-blue-500',
                  )}
                >
                  {location === item.to
                    ? (
                        <item.ActiveIcon className="size-6" />
                      )
                    : (
                        <item.Icon className="size-6" />
                      )}
                </Link>
              </li>
            )
          })}
          <li>
            <Link to="/profile">
              <UserAvatar url={profile?.avatarUrl} username={profile?.username} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
