import type { CurrentUser } from '@/types'
import { UserAvatar } from '@/components/PostElements'
import { Button } from '@/components/ui/button'

interface AvatarSectionProps {
  profile: CurrentUser
  previewUrl: string | null
  onAvatarClick: () => void
}

export function EditProfileAvatarSection({ profile, previewUrl, onAvatarClick }: AvatarSectionProps) {
  return (
    <div className="flex items-start gap-5 rounded-[20px] bg-[#EFEFEF] p-2 lg:p-3 lg:pr-4">
      <UserAvatar
        withBorder={false}
        username={profile.username}
        url={previewUrl || profile.avatarUrl}
        className="size-12 shrink-0 cursor-pointer rounded-full lg:size-[56px]"
        onClick={onAvatarClick}
      />
      <div className="max-w-[340px]">
        <div className="font-bold">{profile.username}</div>
        <div className="break-words text-sm text-gray-600 lg:mt-1">
          {profile.bio}
        </div>
      </div>
      <Button
        variant="default"
        className="mb-1 ml-auto max-w-[114px] self-center"
        onClick={(e) => {
          e.preventDefault()
          onAvatarClick()
        }}
      >
        New photo
      </Button>
    </div>
  )
}
