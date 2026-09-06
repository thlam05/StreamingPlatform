import { Bell, Search } from 'lucide-react'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Creator workspace</p>
        <p className="mt-1 text-sm text-copy-muted">Good evening, welcome back.</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="grid size-10 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-white/5 hover:text-copy" type="button" aria-label="Search">
          <Search className="size-4" aria-hidden="true" />
        </button>
        <button className="grid size-10 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-white/5 hover:text-copy" type="button" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </button>
        <div className="ml-1 grid size-9 place-items-center rounded-full bg-gradient-to-br from-brand to-cyan-300 text-xs font-bold text-ink-950" aria-label="User profile">
          JD
        </div>
      </div>
    </header>
  )
}
