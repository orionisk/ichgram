import type { RecentSearch as RecentSearchType } from '@/hooks/useRecentSearches'
import { UserAvatar } from '@/components/PostElements'
import { Link } from 'wouter'

interface RecentSearchProps {
  recentSearches: RecentSearchType[]
  clearRecentSearches: () => void
  onUserClick: () => void
}

export function RecentSearch({ recentSearches, clearRecentSearches, onUserClick }: RecentSearchProps) {
  if (!recentSearches.length)
    return null

  return (
    <div>
      <div className="mt-5 flex items-center justify-between sm:mt-11">
        <h3 className="text-base font-semibold">Recent</h3>
        <button
          onClick={clearRecentSearches}
          className="text-sm font-semibold text-blue-500 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>
      <div className="mt-2 sm:mt-6">
        {recentSearches.map(user => (
          <Link
            key={user.id}
            href={`/users/${user.username}`}
            className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
            onClick={onUserClick}
          >
            <UserAvatar
              url={user.avatar}
              username={user.username}
            />
            <div>
              <div className="text-sm font-semibold">{user.username}</div>
              <div className="text-xs text-gray-500">{user.fullName}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
