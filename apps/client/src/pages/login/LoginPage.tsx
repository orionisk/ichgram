import logo from '@/assets/logo.png'
import { Link } from 'wouter'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  return (
    <div className="container relative flex min-h-screen items-center justify-center gap-8 max-lg:flex-col max-lg:py-10">
      <div className="grid gap-[10px]">
        <div className="w-full min-w-[350px] max-w-md border border-[#DBDBDB] px-6 py-4 lg:px-10 lg:py-8 lg:pb-4">
          <div className="text-center">
            <img src={logo} alt="logo" className="mx-auto" />
          </div>
          <LoginForm />
        </div>
        <div className="border border-[#DBDBDB] p-4 text-center lg:py-5">
          <p className="text-sm text-gray-600">
            Don't have an account?
            {' '}
            <Link href="/signup" className="text-[#0095F6] hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
