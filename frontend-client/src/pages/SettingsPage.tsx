import { Bell, Palette, ShieldCheck } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand">Workspace</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-copy-muted">A simple page boundary ready for feature-specific settings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { description: 'Manage your visual preferences.', icon: Palette, title: 'Appearance' },
          { description: 'Choose which updates you receive.', icon: Bell, title: 'Notifications' },
          { description: 'Review access and session settings.', icon: ShieldCheck, title: 'Security' },
        ].map(({ description, icon: Icon, title }) => (
          <div className="rounded-2xl border border-border bg-surface p-5" key={title}>
            <Icon className="size-5 text-brand" aria-hidden="true" />
            <h2 className="mt-5 text-base font-semibold text-copy">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-copy-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
