import { Eye, Heart, Radio, Timer, Users, Wifi } from 'lucide-react'

import { useStreamDuration } from '../../hooks/useStreamDuration'
import type { StreamStatusResponse } from '../../types/stream.types'

interface DashboardMetricsProps {
  playbackUrl?: string | null
  status: StreamStatusResponse
}

interface MetricTileProps {
  icon: typeof Eye
  label: string
  value: string
}

function MetricTile({ icon: Icon, label, value }: MetricTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-xs text-copy-muted">
        <Icon aria-hidden="true" className="size-4 text-brand" />
        <span>{label}</span>
      </div>
      <strong className="mt-2 block text-lg font-semibold text-copy">{value}</strong>
    </div>
  )
}

export function DashboardMetrics({ playbackUrl, status }: DashboardMetricsProps) {
  const duration = useStreamDuration(status.startedAt, status.endedAt, status.status === 'live')
  const hasPlayback = Boolean(playbackUrl)

  return (
    <section className="w-full space-y-4 rounded-3xl border border-border bg-surface p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile icon={Users} label="Live viewers" value={(status.viewerCount ?? 0).toLocaleString()} />
        <MetricTile icon={Eye} label="Total views" value={(status.viewCount ?? 0).toLocaleString()} />
        <MetricTile icon={Heart} label="Likes" value={(status.likeCount ?? 0).toLocaleString()} />
        <MetricTile icon={Timer} label="Duration" value={duration} />
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Connection</p>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
          <div className="flex items-center gap-2 text-sm text-copy-muted sm:justify-center">
            <Radio aria-hidden="true" className="size-4 text-brand" />
            <span>Playback</span>
            <strong className="ml-auto text-copy sm:ml-0">{hasPlayback ? 'Ready' : 'Waiting'}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-copy-muted sm:justify-center">
            <Wifi aria-hidden="true" className="size-4 text-brand" />
            <span>Publisher</span>
            <strong className="ml-auto text-copy sm:ml-0">{status.publisherObserved ? 'Detected' : 'Waiting'}</strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-copy-muted sm:justify-center">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
            <span>Start request</span>
            <strong className="ml-auto text-copy sm:ml-0">{status.startRequested ? 'Active' : 'Idle'}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
