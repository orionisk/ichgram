import type { ProfileFormValues } from '@/types'
import { useCurrentProfile, useUpdateProfile } from '@/hooks/useProfile'
import { Loader2 } from 'lucide-react'
import { EditProfileForm } from './EditProfileForm'

export function EditProfilePage() {
  const { data: profile, isLoading } = useCurrentProfile()
  const { mutateAsync: update } = useUpdateProfile()

  if (isLoading || !profile) {
    return (
      <div className="flex size-full h-[80vh] items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[750px] px-5 py-6 lg:px-10 xl:px-20 xl:py-12">
      <div className="max-w-[612px]">
        <h1 className="text-xl font-bold">Edit profile</h1>
        <EditProfileForm
          profile={profile}
          onSubmit={async (values: ProfileFormValues) => {
            await update(values as any)
          }}
        />
      </div>
    </div>
  )
}
