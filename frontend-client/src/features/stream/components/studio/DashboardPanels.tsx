import { MessageSquare } from 'lucide-react'

interface DashboardPanelsProps {
  description?: string | null
  title: string
}

export function DashboardPanels({ description, title }: DashboardPanelsProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="rounded-3xl border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Stream details</p>
        <h2 className="mt-3 text-lg font-semibold text-copy">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-copy-muted">{description || 'No description added.'}</p>
      </div>
      <div className="rounded-3xl border border-border bg-surface p-6">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          <MessageSquare aria-hidden="true" className="size-4" />
          Live activity
        </p>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          Chat and moderation activity will appear here when realtime activity is enabled.
        </p>
      </div>
    </section>
  )
}
