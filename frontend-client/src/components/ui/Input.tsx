import type { InputHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ className, id, label, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-copy" htmlFor={id}>
      {label}
      <input
        {...props}
        id={id}
        className={cn(
          'w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-copy outline-none placeholder:text-copy-muted/60 focus:border-brand focus:ring-2 focus:ring-brand/20',
          className,
        )}
      />
    </label>
  )
}
