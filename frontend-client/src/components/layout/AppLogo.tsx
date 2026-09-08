import { Radio } from 'lucide-react'
import { Link } from 'react-router-dom'

import { APP_NAME } from '../../config/constants'
import { paths } from '../../routes/paths'
import { cn } from '../../utils/cn'

interface AppLogoProps {
  className?: string
  iconClassName?: string
  showName?: boolean
}

export function AppLogo({ className, iconClassName = 'size-5', showName = true }: AppLogoProps) {
  return (
    <Link
      aria-label={showName ? undefined : APP_NAME}
      className={cn('inline-flex items-center gap-2.5 text-lg font-bold tracking-tight', className)}
      to={paths.home}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground">
        <Radio className={iconClassName} aria-hidden="true" />
      </span>
      {showName ? APP_NAME : null}
    </Link>
  )
}
