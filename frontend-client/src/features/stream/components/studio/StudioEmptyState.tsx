import { ArrowRight, Radio } from 'lucide-react'

import { Button } from '../../../../components/ui/Button'

interface StudioEmptyStateProps {
  onCreateStream: () => void
}

export function StudioEmptyState({ onCreateStream }: StudioEmptyStateProps) {
  return (
    <section className="grid justify-items-center rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
      <Radio aria-hidden="true" className="size-8 text-brand" />
      <h2 className="mt-4 text-xl font-semibold text-copy">No streams yet</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-copy-muted">
        Create your first stream to receive private encoder credentials and start building your live room.
      </p>
      <Button className="mt-6" onClick={onCreateStream}>
        Create your first stream
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </section>
  )
}
