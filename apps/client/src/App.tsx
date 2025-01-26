import { Loader2 } from 'lucide-react'
import { Redirect, Route, Switch } from 'wouter'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { useAuthentication } from './hooks/useAuth'
import { useRouteQueryInvalidation } from './hooks/useRouteQueryInvalidation'
import { EditProfilePage, ExplorePage, Home, LoginPage, MessagesPage, NotFoundPage, SignupPage } from './pages'
import { ProfilePage as CombinedProfilePage } from './pages/profile/ProfilePage'
import { ResetPasswordNewPage } from './pages/reset-password/ResetPasswordNewPage'
import { ResetPasswordPage } from './pages/reset-password/ResetPasswordPage'
import 'react-lazy-load-image-component/src/effects/blur.css'

export function App() {
  const { isSuccess, isLoading } = useAuthentication()
  const isAuthenticated = isSuccess

  useRouteQueryInvalidation()

  if (isLoading)
    return <div className="flex h-screen w-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route
        path="/login"
        component={isAuthenticated ? () => <Redirect to="/" /> : LoginPage}
      />
      <Route
        path="/signup"
        component={isAuthenticated ? () => <Redirect to="/" /> : SignupPage}
      />
      <Route
        path="/reset-password"
        component={isAuthenticated ? () => <Redirect to="/" /> : ResetPasswordPage}
      />
      <Route
        path="/reset-password-new"
        component={isAuthenticated ? () => <Redirect to="/" /> : ResetPasswordNewPage}
      />
      <Route
        path="/explore"
        component={() => <ProtectedRoute component={ExplorePage} />}
      />
      <Route
        path="/profile"
        component={() => <ProtectedRoute component={CombinedProfilePage} />}
      />
      <Route
        path="/profile/edit"
        component={() => <ProtectedRoute component={EditProfilePage} />}
      />
      <Route
        path="/users/:username"
        component={() => <ProtectedRoute component={CombinedProfilePage} />}
      />
      <Route
        path="/messages"
        component={() => <ProtectedRoute component={MessagesPage} />}
      />
      <Route
        path="/messages/:username"
        component={() => <ProtectedRoute component={MessagesPage} />}
      />
      <Route
        path="*"
        component={() => <ProtectedRoute component={NotFoundPage} />}
      />
    </Switch>
  )
}
