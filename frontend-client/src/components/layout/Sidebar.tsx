import { Home, LayoutDashboard, Radio, Settings, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

const navigation: ReadonlyArray<{
  expandOnHover?: boolean
  icon: LucideIcon
  label: string
  to: string
}> = [
  {
    expandOnHover: true,
    icon: Home,
    label: 'Overview',
    to: paths.home,
  },
  {
    expandOnHover: true,
    icon: LayoutDashboard,
    label: 'Streamer Studio',
    to: paths.studio,
  },
  {
    expandOnHover: true,
    icon: Radio,
    label: 'Streams',
    to: paths.streams,
  },
  {
    expandOnHover: true,
    icon: Settings,
    label: 'Settings',
    to: paths.settings,
  },
]

export function Sidebar() {
  return (
    <aside
      className="
        fixed bottom-4 left-1/2 z-40
        -translate-x-1/2
        rounded-2xl
        border border-border
        bg-surface/95
        p-2
        shadow-2xl shadow-black/15
        backdrop-blur-sm

        sm:bottom-auto
        sm:left-5
        sm:top-1/2
        sm:w-auto
        sm:translate-x-0
        sm:-translate-y-1/2
        sm:overflow-visible
      "
    >
      <nav
        className="
          flex items-center gap-1
          sm:flex-col
          sm:items-start
        "
        aria-label="Main navigation"
      >
        {navigation.map(({ expandOnHover, icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              cn(
                // 44x44px item
                'group flex h-11 w-11 origin-left items-center justify-center overflow-hidden rounded-xl',

                // Animation
                'transition-[width,background-color,color,box-shadow] duration-300 ease-out',

                // Focus
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',

                // Expand only to the right
                expandOnHover && 'sm:hover:w-44 sm:focus-visible:w-44',

                // State
                isActive
                  ? 'bg-brand text-primary-foreground shadow-sm'
                  : 'text-copy-muted hover:bg-surface-muted/60 hover:text-copy',
              )
            }
          >
            {/* Keep icon in a fixed 44px area */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center">
              <Icon className="size-5" aria-hidden="true" />
            </span>

            {expandOnHover && (
              <span
                className="
                  max-w-0
                  overflow-hidden
                  whitespace-nowrap
                  text-sm
                  font-semibold
                  opacity-0

                  transition-[max-width,opacity]
                  duration-300
                  ease-out

                  sm:group-hover:max-w-32
                  sm:group-hover:pr-4
                  sm:group-hover:opacity-100

                  sm:group-focus-visible:max-w-32
                  sm:group-focus-visible:pr-4
                  sm:group-focus-visible:opacity-100
                "
              >
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
