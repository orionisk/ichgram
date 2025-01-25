import type { ModalType } from '@/types'

import logo from '@/assets/logo.png'
import { NotificationsModal } from '@/components/modals/notifications/NotificationsModal'
import { PostFormModal } from '@/components/modals/post/PostFormModal'
import { SearchModal } from '@/components/modals/search/SearchModal'
import { UserAvatar } from '@/components/PostElements'
import { navItems } from '@/constants/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCurrentProfile } from '@/hooks/useProfile'
import { cn } from '@/lib/utils'
import { Link } from 'wouter'
import { MobileNav } from './MobileNav'

interface SidebarProps {
  location: string
  activeModal: ModalType
  onOpenSheet: (modalType: ModalType, isOpen: boolean) => void
}

export function Sidebar({
  location,
  activeModal,
  onOpenSheet,
}: SidebarProps) {
  const isMobile = useIsMobile()

  const { data: profile } = useCurrentProfile()

  if (isMobile) {
    return <MobileNav location={location} activeModal={activeModal} onOpenSheet={onOpenSheet} profile={profile} />
  }

  const renderNavItem = ({
    to,
    Icon,
    ActiveIcon,
    label,
  }: (typeof navItems)[0]) => {
    if (to === '/notifications') {
      return (
        <NotificationsModal
          open={activeModal === 'notifications'}
          onOpen={isOpen => onOpenSheet('notifications', isOpen)}
          label={label}
        />
      )
    }

    if (to === '/search') {
      return (
        <SearchModal
          open={activeModal === 'search'}
          onOpen={isOpen => onOpenSheet('search', isOpen)}
          label={label}
        />
      )
    }

    if (to === '/create') {
      return (
        <PostFormModal
          open={activeModal === 'create'}
          onOpen={isOpen => onOpenSheet('create', isOpen)}
          mode="create"
        />
      )
    }

    return (
      <Link
        to={to}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 lg:gap-4"
        onClick={() => onOpenSheet(null, false)}
      >
        {(location === to || (to === '/messages' && location.startsWith('/messages')))
        && (!activeModal || ['post-info', 'create', 'post-edit'].includes(activeModal))
          ? (
              <ActiveIcon className="size-5 lg:size-6" />
            )
          : (
              <Icon className="size-5 lg:size-6" />
            )}
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <aside className="h-full w-[var(--sidebar-width)] border-r border-[#DBDBDB] bg-white px-0.5 py-3 lg:px-4 lg:py-5">
      <div className="px-2">
        <img src={logo} alt="logo" className="w-[97px]" />
      </div>
      <nav className="mt-4 lg:mt-7">
        <ul className="grid gap-1.5 md:gap-3.5">
          {navItems.map(item => (
            <li key={item.to}>{renderNavItem(item)}</li>
          ))}
          <li className="mt-5 lg:mt-10">
            <Link
              to="/profile"
              className={cn(
                'flex items-center gap-2 lg:gap-4 p-2 hover:bg-gray-100',
                location.startsWith('/profile')
                && (!activeModal
                  || ['post-info', 'create'].includes(activeModal))
                && 'font-bold',
              )}
            >
              {profile?.avatarUrl && (
                <img src={profile?.avatarUrl} alt="profile" className="size-6 rounded-full" />
              )}
              {!profile?.avatarUrl && (
                <UserAvatar
                  withBorder={false}
                  username={profile?.username}
                  url={profile?.avatarUrl}
                  className="size-6"
                  fallbackClassName="text-[10px]/tight"
                />
              )}
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
