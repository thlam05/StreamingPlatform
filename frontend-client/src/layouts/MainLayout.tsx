import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { useLogout } from '../features/auth/hooks/useLogout'
import { useProfile } from '../features/auth/hooks/useProfile'

export function MainLayout() {
  const profileState = useProfile()
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-ink-950 text-copy">
      <Header
        isProfileLoading={profileState.isLoading}
        onLogout={logout}
        profile={profileState.profile}
        profileError={profileState.error}
      />
      <Sidebar />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 sm:pl-24 sm:pr-8 sm:pt-10 sm:pb-10 lg:pr-8 lg:pt-10">
        <Outlet />
      </main>
    </div>
  )
}
