import { ArrowLeft, CheckCircle2, CircleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { StreamStatusResponse } from '../../types/stream.types'
import { paths } from '../../../../routes/paths'

interface StreamSummaryCardProps {
  status: StreamStatusResponse
}

export function StreamSummaryCard({ status }: StreamSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-8 text-center shadow-xl shadow-black/5">
      {status.status === 'cancelled' ? (
        <CircleAlert aria-hidden="true" className="mx-auto size-10 text-warning" />
      ) : (
        <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-success" />
      )}
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand">{status.status}</p>
      <h1 className="mt-2 text-3xl font-semibold text-copy">{status.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-copy-muted">
        This stream is no longer active. You can return to Studio to manage your other streams or create another one.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          to={paths.studio}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Studio
        </Link>
        <Link
          className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-copy"
          to={paths.studioStreamCreate}
        >
          Create another stream
        </Link>
      </div>
    </section>
  )
}
