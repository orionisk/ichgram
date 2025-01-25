import type { CurrentUser } from '@/types'
import type { ChangeEvent } from 'react'
import { updateProfileReqSchema } from '@ichgram/api/schemas'
import { useRef, useState } from 'react'
import { EditProfileAvatarSection } from './EditProfileAvatarSection'

interface ImageHandlerProps {
  profile: CurrentUser
  onImageChange: (file: File | null) => void
  onImageError: (error: string | null) => void
}

export function EditProfileImageHandler({ profile, onImageChange, onImageError }: ImageHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return

    const tempUrl = URL.createObjectURL(file)
    setPreviewUrl(tempUrl)

    try {
      await updateProfileReqSchema.shape.avatar.parseAsync(file)
      setImageError(null)
      onImageError(null)
      onImageChange(file)
    }
    catch (error) {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message)
          const errorMessage = parsedError[0]?.message ?? 'Invalid file'
          setImageError(errorMessage)
          onImageError(errorMessage)
        }
        catch {
          setImageError(error.message)
          onImageError(error.message)
        }
      }
      if (fileInputRef.current)
        fileInputRef.current.value = ''
      onImageChange(null)
    }
  }

  return (
    <>
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <EditProfileAvatarSection
        profile={profile}
        previewUrl={previewUrl}
        onAvatarClick={handleAvatarClick}
      />

      {imageError && (
        <div className="text-sm text-red-500">
          {imageError}
        </div>
      )}
    </>
  )
}
