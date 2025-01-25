import {
  CreateIcon,
  ExploreActiveIcon,
  ExploreIcon,
  HomeActiveIcon,
  HomeIcon,
  MessageActiveIcon,
  MessageIcon,
  NotificationActiveIcon,
  NotificationIcon,
  SearchActiveIcon,
  SearchIcon,
} from '@/assets/icons/icons'

export const navItems = [
  { to: '/', Icon: HomeIcon, ActiveIcon: HomeActiveIcon, label: 'Home' },
  {
    to: '/search',
    Icon: SearchIcon,
    ActiveIcon: SearchActiveIcon,
    label: 'Search',
  },
  {
    to: '/explore',
    Icon: ExploreIcon,
    ActiveIcon: ExploreActiveIcon,
    label: 'Explore',
  },
  {
    to: '/messages',
    Icon: MessageIcon,
    ActiveIcon: MessageActiveIcon,
    label: 'Messages',
  },
  {
    to: '/notifications',
    Icon: NotificationIcon,
    ActiveIcon: NotificationActiveIcon,
    label: 'Notifications',
  },
  { to: '/create', Icon: CreateIcon, ActiveIcon: CreateIcon, label: 'Create' },
]
