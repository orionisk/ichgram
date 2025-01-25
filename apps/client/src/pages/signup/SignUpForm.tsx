import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthOperations } from '@/hooks/useAuth'
import { getFormDefaults, signupDefaults } from '@/lib/form-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerReqSchema } from '@ichgram/api/schemas'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'wouter'

export function SignupForm() {
  const { register } = useAuthOperations()
  const isLoading = register.isPending
  const form = useForm<z.infer<typeof registerReqSchema>>({
    resolver: zodResolver(registerReqSchema),
    defaultValues: getFormDefaults(signupDefaults),
  })

  async function onSubmit(values: z.infer<typeof registerReqSchema>) {
    register.mutate(values, {
      onError: (error: Error) => {
        if (error.message.toLowerCase().includes('email')) {
          form.setError('email', { message: error.message })
        }
        else if (error.message.toLowerCase().includes('username')) {
          form.setError('username', { message: error.message })
        }
        else {
          form.setError('password', { message: error.message })
        }
      },
    })
  }

  useEffect(() => {
    const subscription = form.watch(() => {
      if (register.error) {
        form.clearErrors()
      }
    })
    return () => subscription.unsubscribe()
  }, [form, register.error])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9 grid gap-2">
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="mt-1 text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Full name"
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
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Username"
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
        <FormDescription className="mt-5 grid gap-4 text-center text-xs text-[#737373]">
          <span className="tracking-tight">
            People who use our service may have uploaded your contact information to
            Instagram.
            <Link href="/" className="ml-1 text-[#00376B]">Learn More</Link>
          </span>
          <span>
            By signing up, you agree to our
            <Link href="/" className="mx-1 text-[#00376B]">Terms</Link>
            <span className="mr-1">,</span>
            <Link href="/" className="mr-1 text-[#00376B]">Privacy Policy</Link>
            and
            <Link href="/" className="ml-1 text-[#00376B]">Cookies Policy</Link>
            <span>.</span>
          </span>
        </FormDescription>
        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
    </Form>
  )
}
