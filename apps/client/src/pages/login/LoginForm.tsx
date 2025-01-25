import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthOperations } from '@/hooks/useAuth'
import { getFormDefaults, loginDefaults } from '@/lib/form-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginReqSchema as formSchema } from '@ichgram/api/schemas'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'wouter'

export function LoginForm() {
  const { login } = useAuthOperations()
  const isLoading = login.isPending
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getFormDefaults(loginDefaults),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    login.mutate(values, {
      onError: (error: Error) => {
        if (error.message.toLowerCase().includes('login')) {
          form.setError('login', { message: error.message })
        }
        else {
          form.setError('password', { message: error.message })
        }
      },
    })
  }

  useEffect(() => {
    const subscription = form.watch(() => {
      if (login.error) {
        form.clearErrors()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, login.error])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <FormField
            control={form.control}
            name="login"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Username, or email"
                    {...field}
                    className={fieldState.error ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    className={fieldState.error ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="mt-1 text-xs text-red-500" />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
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

      <div className="mt-8 text-center lg:mt-16">
        <Link
          to="/reset-password"
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Forgot password?
        </Link>
      </div>
    </>
  )
}
