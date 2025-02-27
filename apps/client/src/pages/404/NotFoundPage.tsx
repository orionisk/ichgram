import loginBg from '@/assets/login-bg.png'

export function NotFoundPage() {
  return (
    <div className="container flex gap-5 px-4 pt-5 max-lg:flex-col max-lg:items-center lg:gap-11 lg:pt-12">
      <div className="mt-6 lg:mt-14">
        <h1 className="text-3xl font-bold lg:text-4xl">Oops! Page Not Found (404 Error)</h1>
        <p className="mt-2 max-w-md text-sm/tight text-[#737373] md:text-base/tight lg:mt-4">
          We're sorry, but the page you're looking for doesn't seem to exist. If
          you typed the URL manually, please double-check the spelling. If you
          clicked on a link, it may be outdated or broken.
        </p>
      </div>
    </div>
  )
}
