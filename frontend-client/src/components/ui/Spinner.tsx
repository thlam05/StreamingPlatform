import { LoaderCircle } from 'lucide-react'

interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-copy-muted" role="status">
      <LoaderCircle className="size-4 animate-spin text-brand" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
