import logo from '@/assets/logo.png'

import { Link } from 'wouter'
import { SignupForm } from './SignUpForm'

export function SignupPage() {
  return (
    <div className="container relative flex min-h-screen items-center justify-center">
      <div className="grid gap-3.5">
        <div className="w-[350px] border border-[#DBDBDB] px-6 py-4 lg:px-10 lg:py-5 lg:pb-2.5">
          <div className="text-center">
            <img src={logo} alt="logo" className="mx-auto" />
          </div>

          <p className="-mt-3 text-center text-base/tight font-semibold text-[#737373]">
            Sign up to see photos and videos from your friends.
          </p>

          <SignupForm />

          <div className="relative mt-5"></div>
        </div>
        <div className="border border-[#DBDBDB] px-6 py-4 text-center lg:px-10 lg:py-6 lg:pb-5">
          <span className="text-sm">Have an account? </span>
          <Link
            href="/login"
            className="inline text-sm text-blue-500 hover:text-blue-700"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
