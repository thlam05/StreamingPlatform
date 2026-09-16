import { Plus } from 'lucide-react'

import { Button } from '../../../../components/ui/Button'

interface StudioHeaderProps {
  onCreateStream: () => void
}

export function StudioHeader({ onCreateStream }: StudioHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-brand">Streamer Studio</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">Your streams</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-copy-muted">
          Manage every stream you have created and continue from the right setup or dashboard.
        </p>
      </div>
      <Button onClick={onCreateStream}>
        <Plus aria-hidden="true" className="size-4" />
        Create stream
      </Button>
    </div>
  )
}
