import type { api } from '@/lib/api-client'
import type { InferResponseType } from '@ichgram/api-client'
import { LinkIcon } from '@/assets/icons/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useFollow } from '@/hooks/useFollow'
import { formatNumber } from '@/lib/utils'
import { Link } from 'wouter'

interface ProfileHeaderProps {
  profile?: InferResponseType<typeof api.user[':username']['profile']['$get'], 200> | (InferResponseType<typeof api.user.me.$get, 200> & { isFollowing?: boolean })
  isOwn?: boolean
}

export function ProfileHeader({ profile, isOwn }: ProfileHeaderProps) {
  const { follow, unfollow } = useFollow(profile?.username ?? '')

  return (
    <Card className="border-[#DBDBDB]">
      <div className="flex items-start gap-5 sm:gap-10 xl:gap-20">
        <div className="rounded-full bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 p-[3px]">
          <div className="rounded-full border-2 border-white">
            <Avatar className="size-16 rounded-full object-cover text-2xl lg:size-24 lg:text-4xl xl:size-[160px] xl:text-5xl">
              <AvatarImage src={profile?.avatarUrl ?? ''} />
              <AvatarFallback>
                {profile?.username
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase() ?? 'T'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 xl:-mt-4">
          <div className="flex items-center gap-4 xl:gap-6">
            <h2 className="text-xl">{profile?.username}</h2>
            {isOwn
              ? (
                  <Link href="/profile/edit">
                    <Button variant="outline" className="bg-[#EFEFEF] px-6 font-bold xl:px-12">
                      Edit profile
                    </Button>
                  </Link>
                )
              : (
                  <div className="flex gap-2">
                    {profile?.isFollowing
                      ? (
                          <Button
                            variant="outline"
                            className="bg-[#0095F6] px-6 font-bold text-white xl:px-12"
                            onClick={() => unfollow.mutateAsync()}
                          >
                            Unfollow
                          </Button>
                        )
                      : (
                          <Button
                            variant="outline"
                            className="bg-[#0095F6] px-6 font-bold text-white xl:px-12"
                            onClick={() => follow.mutateAsync()}
                          >
                            Follow
                          </Button>
                        )}
                    <Button
                      asChild
                      variant="outline"
                      className="bg-[#EFEFEF] px-4 font-bold sm:px-8 xl:px-16"
                    >
                      <Link to={`/messages/${profile?.username}`}>Message</Link>
                    </Button>
                  </div>
                )}
          </div>

          <div className="mt-4 flex max-xs:flex-col xs:gap-5 sm:gap-10 xl:mt-6 xl:gap-[86px]">
            <div>
              <span className="font-semibold">
                {formatNumber(profile?._count.posts ?? 0)}
              </span>
              {' '}
              posts
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(profile?._count.followers ?? 0)}
              </span>
              {' '}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(profile?._count.following ?? 0)}
              </span>
              {' '}
              following
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-3">
              <div className="whitespace-pre-line text-sm">
                {profile.bio}
              </div>
            </div>
          )}

          {profile?.website && (
            <a
              href={`https://${profile?.website}`}
              className="mt-1.5 inline-flex items-center gap-2 text-sm text-[#00376B]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon className="size-3" />
              {profile?.website}
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
