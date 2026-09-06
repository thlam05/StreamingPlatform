import { Radio } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { APP_NAME } from '../config/constants'
import { paths } from '../routes/paths'

export function AuthLayout() {
  return (
    <div className="min-h-[100dvh] bg-background text-copy lg:grid lg:grid-cols-[minmax(20rem,0.86fr)_minmax(32rem,1.14fr)]">
      <aside className="relative hidden min-h-[100dvh] overflow-hidden bg-ink-950 px-10 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
          <div className="absolute -left-24 top-28 size-72 rounded-full border border-brand/20" />
          <div className="absolute -left-12 top-40 size-48 rounded-full border border-brand/20" />
          <div className="absolute bottom-[-7rem] right-[-5rem] size-80 rounded-full border border-white/10" />
        </div>

        <Link className="relative flex w-fit items-center gap-3 text-lg font-bold tracking-tight" to={paths.home}>
          <span className="grid size-10 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-lg shadow-brand/20">
            <Radio className="size-5" aria-hidden="true" />
          </span>
          {APP_NAME}
        </Link>

        <div className="relative mt-auto max-w-lg pb-3">
          <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
            Live by design
          </div>
          <h2 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.04em] xl:text-5xl">
            A quieter room for live ideas.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
            Find your people, follow the signal, and make every stream feel closer.
          </p>

          <div className="mt-12 flex h-24 items-end gap-1.5" aria-hidden="true">
            {[28, 44, 34, 64, 48, 78, 38, 56, 30, 68, 42, 52, 26, 39, 72, 46, 58, 32].map(
              (height, index) => (
                <span
                  className={`w-1.5 rounded-full ${index % 5 === 0 ? 'bg-brand' : 'bg-white/20'}`}
                  key={`${height}-${index}`}
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.18em] text-white/35">
            <span>Signal / 01</span>
            <span>Always in motion</span>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-[100dvh] items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
        <div className="absolute left-5 top-6 flex items-center gap-2 text-sm font-bold tracking-tight lg:hidden">
          <span className="grid size-8 place-items-center rounded-xl bg-brand text-primary-foreground">
            <Radio className="size-4" aria-hidden="true" />
          </span>
          {APP_NAME}
        </div>
        <div className="w-full max-w-[31rem] pt-12 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
