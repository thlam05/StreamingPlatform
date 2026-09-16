import { CalendarClock, CircleDot } from 'lucide-react'

import type { StreamStatusResponse } from '../../types/stream.types'

interface DashboardPanelsProps {
  status: StreamStatusResponse
}

function formatDate(value?: string | null) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function DashboardPanels({ status }: DashboardPanelsProps) {
  return (
    <section className="w-full rounded-3xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Stream details</p>
      <h2 className="mt-3 text-lg font-semibold text-copy">{status.title}</h2>
      <p className="mt-2 text-sm leading-6 text-copy-muted">{status.description || 'No description added.'}</p>
      <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-copy-muted">
            <CalendarClock aria-hidden="true" className="size-4 text-brand" />
            Created
          </dt>
          <dd className="text-right text-copy">{formatDate(status.createdAt)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-copy-muted">
            <CircleDot aria-hidden="true" className="size-4 text-brand" />
            Started
          </dt>
          <dd className="text-right text-copy">{formatDate(status.startedAt)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-copy-muted">
            <CircleDot aria-hidden="true" className="size-4 text-brand" />
            Ended
          </dt>
          <dd className="text-right text-copy">{formatDate(status.endedAt)}</dd>
        </div>
      </dl>
    </section>
  )
}
