import type * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCheckResetToken } from '@/hooks/useAuth'
import { api } from '@/lib/api-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordReqSchema } from '@ichgram/api/schemas'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'wouter'

export function ResetPasswordNewPage() {
  const [, setLocation] = useLocation()
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const { isError, isSuccess } = useCheckResetToken(token ?? undefined)

  const form = useForm<z.infer<typeof resetPasswordReqSchema>>({
    resolver: zodResolver(resetPasswordReqSchema),
    defaultValues: {
      token: token || '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof resetPasswordReqSchema>) {
    try {
      await api.auth['password-reset'].$post({
        json: values,
      })
      setLocation('/login')
    }
    catch (error) {
      if (error instanceof Error) {
        form.setError('password', { message: error.message })
      }
    }
  }

  if (!token) {
    return null
  }

  return (
    <div className="container relative flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[350px]">
        <div className="border border-[#DBDBDB] px-10 py-8">
          {isError
          && (
            <div className="text-center">
              <h1 className="text-base font-semibold">Invalid or expired reset token</h1>
              <Link className="mt-3 block text-sm text-blue-500" to="/reset-password">Request new password reset</Link>
            </div>
          )}
          {isSuccess
          && (
            <>
              <div className="text-center">
                <h1 className="text-base font-semibold">Create New Password</h1>
                <p className="mt-3 text-sm text-[#737373]">
                  Please enter your new password below.
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New password"
                            {...field}
                            className={fieldState.error ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage className="mt-1 text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2">
                    Reset Password
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
