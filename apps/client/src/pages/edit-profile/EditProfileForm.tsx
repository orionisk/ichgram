import type { CurrentUser, ProfileFormValues } from '@/types'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileReqSchema } from '@ichgram/api/schemas'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { EditProfileFormFields } from './EditProfileFormFields'
import { EditProfileImageHandler } from './EditProfileImageHandler'

interface ProfileFormProps {
  profile: CurrentUser
  onSubmit: (values: ProfileFormValues) => Promise<void>
}

export function EditProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(profile.avatarUrl)
  const [showCheck, setShowCheck] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileReqSchema),
    defaultValues: {
      username: profile.username,
      bio: profile.bio ?? '',
      website: profile.website ?? '',
      avatar: null,
    },
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    form.setValue('avatar', file, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  useEffect(() => {
    const subscription = form.watch(() => {
      if (Object.keys(form.formState.errors).length > 0)
        form.clearErrors()
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      const changedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (key === 'avatar') {
          if (imageFile)
            acc[key] = imageFile
          return acc
        }

        const initialValue = form.formState.defaultValues?.[key as keyof ProfileFormValues]
        if (value !== initialValue)
          acc[key as keyof Omit<ProfileFormValues, 'avatar'>] = value as string

        return acc
      }, {} as Partial<ProfileFormValues>)

      await onSubmit(changedValues)

      form.reset({
        username: values.username,
        bio: values.bio,
        website: values.website,
        avatar: null,
      })

      if (imageFile) {
        const newImageUrl = URL.createObjectURL(imageFile)
        setCurrentImageUrl(newImageUrl)
        setImageFile(null)
      }

      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 2000)
    }
    catch (error) {
      if (!(error instanceof Error))
        return

      const errorMsg = error.message.toLowerCase()
      type FormField = keyof ProfileFormValues

      const fieldErrors: FormField[] = ['username', 'bio', 'website', 'avatar']
      const errorField = fieldErrors.find(field => errorMsg.includes(field)) ?? 'username'

      form.setError(errorField, { message: error.message })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 grid gap-3 lg:mt-8 lg:gap-5">
        <EditProfileImageHandler
          profile={{ ...profile, avatarUrl: currentImageUrl }}
          onImageChange={handleImageChange}
          onImageError={setImageError}
        />

        <EditProfileFormFields form={form} />

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            className="mt-6 w-full max-w-56 sm:max-w-[268px] lg:mt-12"
            disabled={
              form.formState.isSubmitting
              || (!form.formState.isDirty && !imageFile)
              || Object.keys(form.formState.errors).length > 0
              || !!imageError
            }
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          {showCheck && (
            <Check className="mt-6 size-6 text-green-500 animate-in fade-in lg:mt-12" />
          )}
        </div>
      </form>
    </Form>
  )
}
