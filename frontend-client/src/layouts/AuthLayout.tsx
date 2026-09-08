import { Headphones, Radio, Users } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import { AppLogo } from '../components/layout/AppLogo'

export function AuthLayout() {
  return (
    <div className="auth-light min-h-[100dvh] bg-background text-copy">
      <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2">
        <aside className="relative flex min-h-[18rem] flex-col overflow-hidden bg-surface-muted px-6 py-7 sm:px-10 lg:min-h-[100dvh] lg:px-14 lg:py-10">
          <AppLogo className="absolute left-6 top-7 sm:left-10 lg:left-14 lg:top-10" iconClassName="size-4" />

          <div className="relative mt-auto max-w-md pt-20 lg:mb-10 lg:mt-auto">
            <p className="mb-4 text-sm font-semibold text-brand-readable">Your live space</p>
            <h2 className="max-w-lg text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-copy sm:text-5xl">
              Stay close to the conversations you choose.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-copy-muted">
              Streamline brings live creators, listeners, and ideas into one focused place.
            </p>

            <div className="mt-10 flex items-center gap-3" aria-hidden="true">
              <div className="grid size-12 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-sm">
                <Headphones className="size-5" />
              </div>
              <div className="grid size-12 place-items-center rounded-2xl border border-brand/30 bg-surface text-brand-readable shadow-sm">
                <Users className="size-5" />
              </div>
              <div className="grid size-12 place-items-center rounded-2xl border border-brand/30 bg-surface text-brand-readable shadow-sm">
                <Radio className="size-5" />
              </div>
              <div className="ml-2 h-px w-16 bg-brand/30" />
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-24 -right-20 size-72 rounded-full border border-brand/25" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-[-4.5rem] right-[-0.5rem] size-40 rounded-full border border-brand/20" aria-hidden="true" />
        </aside>

        <main className="flex min-h-[calc(100dvh-18rem)] items-center justify-center bg-background px-5 py-10 sm:px-8 lg:min-h-[100dvh] lg:px-12 xl:px-20">
          <div className="w-full max-w-[28rem]">
            <Outlet />
            <p className="mt-8 text-center text-xs text-copy-muted lg:hidden">A focused place for the streams you choose.</p>
          </div>
        </main>
      </div>
    </div>
  )
}
