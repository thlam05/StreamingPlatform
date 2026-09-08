import { Outlet } from 'react-router-dom'

import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { useLogout } from '../features/auth/hooks/useLogout'
import { useProfile } from '../features/auth/hooks/useProfile'

export function MainLayout() {
  const profileState = useProfile()
  const logout = useLogout()

  return (
    <div className="min-h-screen bg-ink-950 text-copy lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header
          isProfileLoading={profileState.isLoading}
          onLogout={logout}
          profile={profileState.profile}
          profileError={profileState.error}
        />
        <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
