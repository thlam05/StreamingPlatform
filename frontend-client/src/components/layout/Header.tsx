import { Bell, LogOut, Search } from 'lucide-react'

import type { AuthUser } from '../../features/auth/types/auth.types'

interface HeaderProps {
  isProfileLoading: boolean
  onLogout: () => void
  profile: AuthUser | null
  profileError: string | null
}

export function Header({ isProfileLoading, onLogout, profile, profileError }: HeaderProps) {
  const initials =
    profile?.displayName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'JD'

  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Creator workspace</p>
        <p className="mt-1 text-sm text-copy-muted">Good evening, welcome back.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="grid size-10 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-white/5 hover:text-copy"
          type="button"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-10 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-white/5 hover:text-copy"
          type="button"
          aria-label="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </button>
        <div className="ml-1 hidden min-w-0 text-right sm:block">
          <p className="truncate text-sm font-semibold text-copy">{profile?.displayName || 'Your profile'}</p>
          <p className="truncate text-xs text-copy-muted">
            {profile?.email ||
              (profileError
                ? 'Profile unavailable'
                : isProfileLoading
                  ? 'Loading profile...'
                  : 'No profile information')}
          </p>
        </div>
        <div
          className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground"
          aria-label={`${profile?.displayName || 'User'} profile`}
        >
          {initials}
        </div>
        <button
          aria-label="Sign out"
          className="grid size-10 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={onLogout}
          type="button"
        >
          <LogOut className="size-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
