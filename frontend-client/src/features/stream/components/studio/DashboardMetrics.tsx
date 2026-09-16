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
    <aside className="space-y-4 rounded-3xl border border-border bg-surface p-5">
      <div className="grid grid-cols-2 gap-3">
        <MetricTile icon={Users} label="Live viewers" value={(status.viewerCount ?? 0).toLocaleString()} />
        <MetricTile icon={Eye} label="Total views" value={(status.viewCount ?? 0).toLocaleString()} />
        <MetricTile icon={Heart} label="Likes" value={(status.likeCount ?? 0).toLocaleString()} />
        <MetricTile icon={Timer} label="Duration" value={duration} />
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Connection</p>
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <Radio aria-hidden="true" className="size-4 text-brand" />
          <span>Playback</span>
          <strong className="ml-auto text-copy">{hasPlayback ? 'Ready' : 'Waiting'}</strong>
        </div>
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <Wifi aria-hidden="true" className="size-4 text-brand" />
          <span>Publisher</span>
          <strong className="ml-auto text-copy">{status.publisherObserved ? 'Detected' : 'Waiting'}</strong>
        </div>
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
          <span>Start request</span>
          <strong className="ml-auto text-copy">{status.startRequested ? 'Active' : 'Idle'}</strong>
        </div>
      </div>
      <p className="border-t border-border pt-4 text-sm leading-6 text-copy-muted">
        Keep this dashboard open while you broadcast. Metrics and connection status update automatically.
      </p>
    </aside>
  )
}
