import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  ghost: 'text-copy-muted hover:bg-white/5 hover:text-copy',
  primary: 'bg-brand text-primary-foreground hover:bg-brand-strong',
  secondary: 'border border-border bg-surface text-copy hover:border-brand/60 hover:bg-surface-muted',
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  )
}
