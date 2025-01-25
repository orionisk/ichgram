import TroubleIcon from '@/assets/icons/trouble.svg'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePasswordReset } from '@/hooks/useAuth'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'wouter'
import * as z from 'zod'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormValues = z.infer<typeof formSchema>

export function ResetPasswordPage() {
  const { mutateAsync: requestPasswordReset } = usePasswordReset()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      await requestPasswordReset(values.email)
      form.reset()
    }
    catch {
      form.setError('email', { message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="container relative flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[350px]">
        <div className="border border-[#DBDBDB] px-10 py-8">
          <div className="flex justify-center">
            <TroubleIcon />
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-base font-semibold">Trouble logging in?</h1>
            <p className="mt-3 text-sm text-[#737373]">
              Enter your email and we'll send you a link to get back into your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className={fieldState.error ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    <FormMessage className="mt-1 text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2">
                Send reset link
              </Button>
            </form>
          </Form>

          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DBDBDB]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-[13px] font-semibold text-[#737373]">
                OR
              </span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/signup"
              className="text-sm text-[#262626] hover:text-[#737373]"
            >
              Create new account
            </Link>
          </div>
        </div>

        <div className="mt-3 border border-[#DBDBDB] p-5 text-center">
          <Link
            href="/login"
            className="text-sm text-[#262626] hover:text-[#737373]"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
