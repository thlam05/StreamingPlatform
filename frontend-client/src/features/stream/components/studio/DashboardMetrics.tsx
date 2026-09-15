import { Radio, Users } from 'lucide-react'

interface DashboardMetricsProps {
  hasPlayback: boolean
  viewerCount: number
}

export function DashboardMetrics({ hasPlayback, viewerCount }: DashboardMetricsProps) {
  return (
    <aside className="space-y-4 rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-copy-muted">
        <Users aria-hidden="true" className="size-4 text-brand" />
        <span className="text-sm">Viewers</span>
        <strong className="ml-auto text-copy">{viewerCount.toLocaleString()}</strong>
      </div>
      <div className="flex items-center gap-2 text-copy-muted">
        <Radio aria-hidden="true" className="size-4 text-brand" />
        <span className="text-sm">Playback</span>
        <strong className="ml-auto text-copy">{hasPlayback ? 'Ready' : 'Waiting'}</strong>
      </div>
      <p className="border-t border-border pt-4 text-sm leading-6 text-copy-muted">
        Keep this dashboard open while you broadcast. Status and playback update automatically.
      </p>
    </aside>
  )
}
