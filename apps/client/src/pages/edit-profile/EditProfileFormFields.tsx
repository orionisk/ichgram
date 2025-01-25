import type { UseFormReturn } from 'react-hook-form'
import { LinkIcon } from '@/assets/icons/icons'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormFieldsProps {
  form: UseFormReturn<any>
}

export function EditProfileFormFields({ form }: FormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-base font-bold">Username</FormLabel>
            <FormControl>
              <Input
                {...field}
                variant="profile"
                className={cn('mt-1', fieldState.error && 'border-red-500')}
              />
            </FormControl>
            <FormMessage className="mt-1 text-xs text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-base font-bold">Website</FormLabel>
            <FormControl>
              <div className="relative mt-3">
                <Input
                  {...field}
                  variant="website"
                  className={fieldState.error ? 'border-red-500' : ''}
                />
                <LinkIcon className="absolute left-4 top-1/2 size-3 -translate-y-1/2 text-gray-500" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="text-base font-bold">About</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  {...field}
                  className={cn(
                    'mt-1 h-[65px] resize-none overflow-y-hidden rounded-xl border border-[#DBDFE4] px-5 pt-1 leading-tight',
                    fieldState.error && 'border-red-500',
                  )}
                />
                <div className="absolute -bottom-6 right-4 mt-1 text-right text-xs text-[#737373]">
                  {field.value?.length ?? 0}
                  {' '}
                  / 90
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
