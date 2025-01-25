import { LazyImage } from '@/components/LazyImage'
import { useUserPosts } from '@/hooks/usePosts'
import { useCurrentProfile, useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Redirect, useParams } from 'wouter'
import { ProfileHeader } from './ProfileHeader'

export function ProfilePage() {
  const { username } = useParams()
  const [, setPostId] = useQueryState('postId')
  const { ref, inView } = useInView({
    rootMargin: '100px',
  })

  const { data: currentProfile, isLoading: isCurrentProfileLoading } = useCurrentProfile()
  const { data: userProfile, isLoading: isUserLoading, isError: isUserError } = useProfile(username)
  const profile = username ? userProfile : currentProfile

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostsLoading,
  } = useUserPosts(profile?.username ?? '')

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage)
      fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  if (isUserError) {
    return <Redirect to="/404" replace />
  }

  if (isUserLoading || isCurrentProfileLoading || !profile) {
    return (
      <div className="flex size-full h-[80vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  if (username && currentProfile?.username === username) {
    return <Redirect to="/profile" replace />
  }

  const allPosts = data?.pages.flatMap(page => page?.items ?? []) ?? []

  return (
    <div className="p-5 lg:px-10 lg:py-6 xl:px-20 xl:py-12">
      <div className="max-w-[930px]">
        <ProfileHeader
          profile={profile}
          isOwn={!username}
        />

        {isPostsLoading
          ? (
              <div className="mt-8 flex justify-center xl:mt-16">
                <Loader2 className="size-8 animate-spin" />
              </div>
            )
          : (
              <div className="relative z-0 mt-8 grid gap-1 xs:grid-cols-2 lg:grid-cols-3 xl:mt-16">
                {allPosts.map(post => (
                  <div key={post.id} className="aspect-square cursor-pointer max-xs:mx-auto max-xs:w-[300px]">
                    <motion.div
                      className="aspect-square cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setPostId(post.id)}
                    >
                      <LazyImage
                        src={post.imageUrl}
                        className="size-full"
                        imageClassName="object-top"
                        loaderClassName="absolute inset-0 size-full"
                        alt={`Post preview by ${profile.username}`}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            )}

        {isFetchingNextPage && (
          <div className="mt-5 flex justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}

        {!isPostsLoading && <div ref={ref} className="h-10 w-full lg:h-20" />}
      </div>
    </div>
  )
}
