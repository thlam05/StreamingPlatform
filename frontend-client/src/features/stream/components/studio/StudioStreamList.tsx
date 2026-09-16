import { ArrowRight, CalendarDays, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { StreamStatus, StreamStatusResponse } from '../../types/stream.types'
import { paths } from '../../../../routes/paths'

const statusLabels: Record<StreamStatus, string> = {
  scheduled: 'Scheduled',
  preview: 'Preview',
  live: 'Live',
  ended: 'Ended',
  cancelled: 'Cancelled',
}

function formatDate(value?: string) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function statusClasses(status: StreamStatus) {
  if (status === 'live') return 'border-success/30 bg-success/10 text-success'
  if (status === 'preview') return 'border-brand/30 bg-brand/10 text-brand'
  if (status === 'cancelled') return 'border-danger/30 bg-danger/10 text-danger'
  return 'border-border bg-surface-muted text-copy-muted'
}

function getStreamAction(stream: StreamStatusResponse) {
  if (stream.status === 'live') return { label: 'Open dashboard', to: paths.studioStreamDashboard(stream.id) }
  if (stream.status === 'ended' || stream.status === 'cancelled') {
    return { label: 'View summary', to: paths.studioStreamSummary(stream.id) }
  }
  return { label: 'Open setup', to: paths.studioStreamSetup(stream.id) }
}

function StudioStreamRow({ stream }: { stream: StreamStatusResponse }) {
  const action = getStreamAction(stream)

  return (
    <article className="grid gap-4 border-t border-border px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
          <Video aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-copy">{stream.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-copy-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {formatDate(stream.createdAt)}
            </span>
            {typeof stream.viewerCount === 'number' ? <span>{stream.viewerCount.toLocaleString()} viewers</span> : null}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(stream.status)}`}>
          <span aria-hidden="true" className="mr-1.5">
            •
          </span>
          {statusLabels[stream.status]}
        </span>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-copy"
          to={action.to}
        >
          {action.label}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  )
}

interface StudioStreamListProps {
  streams: StreamStatusResponse[]
}

export function StudioStreamList({ streams }: StudioStreamListProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/5">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">All my streams</p>
          <p className="mt-1 text-sm text-copy-muted">
            {streams.length} created stream{streams.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link className="text-sm font-semibold text-copy-muted hover:text-copy" to={paths.home}>
          Back home
        </Link>
      </div>
      {streams.map((stream) => (
        <StudioStreamRow key={stream.id} stream={stream} />
      ))}
    </section>
  )
}
