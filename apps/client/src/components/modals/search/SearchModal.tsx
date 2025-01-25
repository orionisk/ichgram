import type { InferResponseType } from '@ichgram/api-client'
import { SearchActiveIcon, SearchIcon, X } from '@/assets/icons/icons'
import { Input } from '@/components/ui/input'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useRecentSearches } from '@/hooks/useRecentSearches'
import { api } from '@/lib/api-client'

import { useQuery } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'
import { Link } from 'wouter'
import { UserAvatar } from '../../PostElements'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet'
import { RecentSearch } from './RecentSearch'

export function SearchModal({
  open,
  onOpen,
  label,
}: {
  open: boolean
  onOpen: (open: boolean) => void
  label: string
}) {
  useEscapeKey(open, () => onOpen(false))
  const [search, setSearch] = useDebounceValue('', 300)
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches()

  const { data: searchResults } = useQuery({
    queryKey: ['search', search],
    queryFn: async () => {
      if (!search)
        return null
      const response = await api.user.search.$get({
        query: { name: search[0] },
      })
      if (!response.ok)
        throw new Error('Search failed')
      const data = await response.json()
      return data as InferResponseType<typeof api.user.search.$get, 200>
    },
    enabled: !!search,
  })

  const handleUserClick = (user: InferResponseType<typeof api.user.search.$get, 200>[number]) => {
    addRecentSearch({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatarUrl,
    })
    onOpen(false)
  }

  return (
    <Sheet modal={false} open={open}>
      <SheetTrigger
        className="flex w-full items-center gap-2 p-2 hover:bg-gray-100 lg:gap-4"
        onClick={() => onOpen(!open)}
      >
        {open ? <SearchActiveIcon className="size-5 lg:size-6" /> : <SearchIcon className="size-5 lg:size-6" />}
        <span className="max-sm:hidden">{label}</span>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-r-2xl p-3 shadow-[4px_0px_24px_rgba(0,0,0,0.15)] sm:p-6 sm:py-5 sm:pr-4">
        <SheetClose asChild className="absolute right-3 top-2 sm:hidden">
          <button onClick={() => onOpen(false)}>
            <XIcon className="size-6" />
          </button>
        </SheetClose>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold sm:text-2xl">Search</SheetTitle>
          <SheetDescription className="sr-only">Search for users</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-6 sm:mt-9">
          <div className="relative">
            <Input
              placeholder="Search"
              onChange={e => setSearch(e.target.value)}
              variant="search"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
              >
                <img src={X} alt="x" className="size-5 text-gray-500" />
              </button>
            )}
          </div>

          {searchResults && searchResults.length > 0 && (
            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {searchResults.map(user => (
                <Link
                  key={user.id}
                  href={`/users/${user.username}`}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100"
                  onClick={() => handleUserClick(user)}
                >
                  <UserAvatar
                    url={user?.avatarUrl}
                    username={user.username}
                    className="size-10"
                  />
                  <div>
                    <div className="text-sm font-semibold">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.fullName}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search && (
            <RecentSearch
              recentSearches={recentSearches}
              clearRecentSearches={clearRecentSearches}
              onUserClick={() => onOpen(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
