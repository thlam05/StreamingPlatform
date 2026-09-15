import { Radio } from 'lucide-react'

import type { StreamStatusResponse } from '../../types/stream.types'

interface DashboardStatusProps {
  isLive: boolean
  isTerminal: boolean
  status: StreamStatusResponse
  statusLabel: string
}

export function DashboardStatus({ isLive, isTerminal, status, statusLabel }: DashboardStatusProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <Radio aria-hidden="true" className="size-4" />
          {statusLabel}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-copy">{status.title}</h1>
        <p className="mt-2 text-sm text-copy-muted">
          {status.startRequested && !isLive
            ? 'Your start request was accepted. We are waiting for the livestream to become live.'
            : isTerminal
              ? 'This livestream has ended.'
              : 'Monitor your broadcast from this dashboard.'}
        </p>
      </div>
      <span
        className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${isLive ? 'border-success/30 bg-success/10 text-success' : 'border-brand/30 bg-brand/10 text-brand'}`}
      >
        <span aria-hidden="true" className="mr-1.5">
          ●
        </span>
        {statusLabel}
      </span>
    </div>
  )
}
