import { useLocalStorage } from 'usehooks-ts'

export interface RecentSearch {
  id: string
  username: string
  fullName: string
  avatar: string | null
}

const MAX_RECENT_SEARCHES = 5

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<RecentSearch[]>('recent-searches', [])

  const addRecentSearch = (user: RecentSearch) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(search => search.id !== user.id)
      return [user, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  }
}
