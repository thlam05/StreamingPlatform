import { Home, LayoutDashboard, Radio, Settings, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

const navigation: ReadonlyArray<{
  icon: LucideIcon
  label: string
  to: string
}> = [
  {
    icon: Home,
    label: 'Overview',
    to: paths.home,
  },
  {
    icon: LayoutDashboard,
    label: 'Streamer Studio',
    to: paths.studio,
  },
  {
    icon: Radio,
    label: 'Streams',
    to: paths.streams,
  },
  {
    icon: Settings,
    label: 'Settings',
    to: paths.settings,
  },
]

export function Sidebar() {
  return (
    <aside
      className="
        group/sidebar
        fixed bottom-4 left-1/2 z-40
        -translate-x-1/2
        rounded-2xl
        border border-border
        bg-surface/95
        p-2
        shadow-2xl shadow-black/15
        backdrop-blur-sm

        transition-[width]
        duration-300
        ease-out

        sm:bottom-auto
        sm:left-5
        sm:top-1/2
        sm:w-[62px]
        sm:translate-x-0
        sm:-translate-y-1/2
        sm:overflow-hidden
        sm:hover:w-52
      "
    >
      <nav
        className="
          flex items-center gap-2
          sm:flex-col
          sm:items-start
        "
        aria-label="Main navigation"
      >
        {navigation.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex h-11 w-11 shrink-0 items-center overflow-hidden rounded-xl',
                'transition-[width,background-color,color,box-shadow] duration-300 ease-out',

                'focus-visible:outline-2',
                'focus-visible:outline-offset-2',
                'focus-visible:outline-brand',

                // Expand every item when sidebar is hovered
                'sm:group-hover/sidebar:w-[190px]',

                isActive
                  ? 'bg-brand text-primary-foreground shadow-sm'
                  : 'text-copy-muted hover:bg-surface-muted/60 hover:text-copy',
              )
            }
          >
            {/* Fixed icon area */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center">
              <Icon className="size-5 shrink-0" aria-hidden="true" />
            </span>

            {/* Label */}
            <span
              className="
                pointer-events-none
                whitespace-nowrap
                pr-4
                text-sm
                font-semibold
                opacity-0
                transition-opacity
                duration-200

                sm:group-hover/sidebar:opacity-100
                sm:group-focus-within/sidebar:opacity-100
              "
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
