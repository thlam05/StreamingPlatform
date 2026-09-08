import type { InputHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label: string
}

export function Input({ className, error, id, label, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-copy" htmlFor={id}>
      {label}
      <input
        {...props}
        id={id}
        aria-describedby={error && id ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-xl border border-border bg-surface-muted px-3.5 py-3 text-copy outline-none placeholder:text-copy-muted focus:border-brand focus:ring-2 focus:ring-brand/20',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
      />
      {error ? <span className="text-xs font-normal text-danger" id={id ? `${id}-error` : undefined}>{error}</span> : null}
    </label>
  )
}
