import type { ReactElement } from 'react'
import { ModalProvider } from '@/contexts/ModalContext'

import { useAuthentication } from '@/hooks/useAuth'
import { AuthLayout } from '@/layouts/auth/AuthLayout'
import { Redirect } from 'wouter'
import { PostModalContainer } from '../modals/post-info/PostModalContainer'
import { PostEditModalContainer } from '../modals/post/PostEditModalContainer'

export function ProtectedRoute({
  component: Component,
}: {
  component: () => ReactElement
}) {
  const { isSuccess: isAuthenticated } = useAuthentication()
  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return (
    <ModalProvider>
      <AuthLayout>
        <Component />
      </AuthLayout>
      <PostModalContainer />
      <PostEditModalContainer />
    </ModalProvider>
  )
}
