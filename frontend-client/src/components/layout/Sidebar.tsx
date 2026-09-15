import { Home, LayoutDashboard, PlusCircle, Radio, Settings, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { AppLogo } from './AppLogo'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

const navigation: ReadonlyArray<{ icon: LucideIcon; label: string; to: string }> = [
  { icon: Home, label: 'Overview', to: paths.home },
  { icon: LayoutDashboard, label: 'Streamer Studio', to: paths.studio },
  { icon: Radio, label: 'Streams', to: paths.streams },
  { icon: PlusCircle, label: 'Create stream', to: paths.studioStreamCreate },
]

export function Sidebar() {
  return (
    <aside className="border-b border-border bg-ink-900 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6">
        <AppLogo />
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:gap-1 lg:px-3" aria-label="Main navigation">
        {navigation.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                'inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand/12 text-brand' : 'text-copy-muted hover:bg-white/5 hover:text-copy',
              )
            }
            key={to}
            to={to}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="hidden border-t border-border px-3 pt-4 lg:block">
        <NavLink
          className="inline-flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-copy-muted transition-colors hover:bg-white/5 hover:text-copy"
          to={paths.settings}
        >
          <Settings className="size-4" aria-hidden="true" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
