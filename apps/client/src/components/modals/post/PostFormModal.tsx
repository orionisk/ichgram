import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import { CreateIcon } from '@/assets/icons/icons'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCreatePost, useUpdatePost } from '@/hooks/usePosts'
import { useCurrentProfile } from '@/hooks/useProfile'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostReqSchema, updatePostReqSchema } from '@ichgram/api/schemas'
import { XIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreatePostDescription, CreatePostImageUploader } from '../create-post'

interface PostFormModalProps {
  open: boolean
  onOpen: (open: boolean) => void
  mode: 'create' | 'edit'
  initialData?: {
    id: string
    content?: string | null
    imageUrl?: string
  }
  trigger?: React.ReactNode
}

function getAllFormErrors(form: UseFormReturn<any>) {
  const errors = form.formState.errors
  return Object.entries(errors)
    .map(([_, error]) => (error)?.message)
    .filter(Boolean)
    .join('\n')
}

export function PostFormModal({
  open,
  onOpen,
  mode,
  initialData,
  trigger,
}: PostFormModalProps) {
  const [, setPostId] = useQueryState('postId')
  const schema = mode === 'create' ? createPostReqSchema : updatePostReqSchema
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: initialData?.content ?? '',
      image: undefined,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const { data: currentUser } = useCurrentProfile()
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost()
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost()
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.imageUrl ?? null)

  const handleImageSelect = (image: File) => {
    form.setValue('image', image, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    const imageUrl = URL.createObjectURL(image)
    setPreviewImage(imageUrl)
  }

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    try {
      let post

      if (mode === 'create') {
        post = await createPost({
          image: values.image as File,
          content: values.content as string,
        })
      }
      else if (initialData?.id) {
        post = await updatePost({
          id: initialData.id,
          content: values.content as string,
          image: values.image as File,
        })
      }

      if (post) {
        form.reset()
        setPreviewImage(null)
        onOpen(false)
        setTimeout(() => {
          setPostId(post.id)
        }, 100)
      }
    }
    catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        if (message.includes('content')) {
          form.setError('content', { message: error.message })
        }
        else if (message.includes('image')) {
          form.setError('image', { message: error.message })
        }
        else {
          form.setError('content', { message: error.message })
          form.setError('image', { message: error.message })
        }
      }
    }
  }

  const isPending = isCreating || isUpdating
  const title = mode === 'create' ? 'Create new post' : 'Edit post'
  const buttonText = isPending
    ? mode === 'create' ? 'Sharing...' : 'Saving...'
    : mode === 'create' ? 'Share' : 'Save'

  const isDisabled = mode === 'create'
    ? !form.getValues('image') || isPending || !form.formState.isValid
    : isPending || (!form.formState.isDirty && !form.getValues('image')) || !form.formState.isValid

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <button
            className="flex w-full items-center gap-3 p-2 hover:bg-gray-100 lg:gap-4"
            onClick={() => onOpen(!open)}
          >
            <CreateIcon className="size-4 text-[#737373] md:size-5" />
            <span className="max-sm:hidden">Create</span>
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="fixed left-1/2 top-1/2 h-[564px] max-h-screen w-full max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-0 focus-visible:outline-none sm:left-[calc(50%+var(--sidebar-width)/2)] sm:max-w-[calc(95vw-var(--sidebar-width))] xl:max-w-[913px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <SheetHeader className="flex items-center border-b border-[#DBDBDB] px-6 py-2">
              <SheetClose asChild className="absolute left-3 top-2 sm:hidden">
                <button onClick={() => onOpen(false)}>
                  <XIcon className="size-6" />
                </button>
              </SheetClose>
              <SheetTitle className="mt-0.5 text-center text-base font-semibold">
                {title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {title}
              </SheetDescription>
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-0 text-sm font-semibold text-[#0095F6] hover:bg-transparent"
                disabled={isDisabled}
              >
                {buttonText}
              </Button>
            </SheetHeader>

            <div className="grid h-[calc(564px-43px)] grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.365fr,1fr]">
              <div className="relative flex items-center justify-center overflow-hidden bg-white">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem className="size-full">
                      <FormControl>
                        <CreatePostImageUploader
                          selectedImage={previewImage}
                          onImageSelect={handleImageSelect}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col border-l border-[#DBDBDB] bg-white">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <CreatePostDescription
                          caption={field.value ?? ''}
                          onCaptionChange={field.onChange}
                          currentUser={currentUser}
                        />
                      </FormControl>
                      {Object.keys(form.formState.errors).length > 0
                        ? (
                            <div className="whitespace-pre rounded-md bg-red-50 px-4 py-2 text-center text-sm text-red-500">
                              {getAllFormErrors(form)}
                            </div>
                          )
                        : (
                            <div className="h-8" />
                          )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
