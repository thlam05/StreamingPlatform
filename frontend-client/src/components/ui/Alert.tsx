import { CircleAlert, CheckCircle2, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'

export type AlertVariant = 'error' | 'info' | 'success' | 'warning'

interface AlertProps {
  action?: ReactNode
  children: ReactNode
  className?: string
  title?: string
  variant?: AlertVariant
}

const alertStyles: Record<AlertVariant, { icon: LucideIcon; iconClassName: string; className: string }> = {
  error: {
    className: 'border-danger/30 bg-danger/10 text-danger',
    icon: CircleAlert,
    iconClassName: 'text-danger',
  },
  info: {
    className: 'border-brand/30 bg-brand/10 text-brand',
    icon: Info,
    iconClassName: 'text-brand',
  },
  success: {
    className: 'border-success/30 bg-success/10 text-success',
    icon: CheckCircle2,
    iconClassName: 'text-success',
  },
  warning: {
    className: 'border-warning/30 bg-warning/10 text-warning',
    icon: TriangleAlert,
    iconClassName: 'text-warning',
  },
}

export function Alert({ action, children, className, title, variant = 'info' }: AlertProps) {
  const config = alertStyles[variant]
  const Icon = config.icon

  return (
    <div
      className={cn('flex items-start gap-3 rounded-2xl border p-4 text-sm', config.className, className)}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
    >
      <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', config.iconClassName)} />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? 'mt-1 leading-6' : 'leading-6'}>{children}</div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
