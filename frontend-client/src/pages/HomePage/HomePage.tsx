import { ArrowRight, Play, Sparkles, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { StreamCard } from '../../features/stream/components/list/StreamCard'
import { useStreams } from '../../features/stream/hooks/useStreams'
import { paths } from '../../routes/paths'

export function HomePage() {
  const navigate = useNavigate()
  const { error, isLoading, streams } = useStreams()

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 size-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your next audience is already here
          </div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-copy sm:text-5xl sm:leading-[1.08]">
            Make space for your best live work.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-copy-muted sm:text-lg">
            Discover independent creators, follow the conversations you care about, and keep every stream in one focused workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button onClick={() => navigate(paths.streams)}>
              Explore streams <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Link className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-copy-muted transition-colors hover:text-copy" to={paths.login}>
              <Play className="size-4" aria-hidden="true" />
              Start creating
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Live creators', value: '2,481', icon: Users },
          { label: 'Hours watched', value: '18.6k', icon: Play },
          { label: 'Active communities', value: '342', icon: Sparkles },
        ].map(({ icon: Icon, label, value }) => (
          <div className="rounded-2xl border border-border bg-surface p-5" key={label}>
            <Icon className="size-5 text-brand" aria-hidden="true" />
            <p className="mt-5 text-2xl font-semibold text-copy">{value}</p>
            <p className="mt-1 text-sm text-copy-muted">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">Live now</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-copy">Find your next watch</h2>
          </div>
          <Link className="hidden text-sm font-semibold text-copy-muted hover:text-copy sm:block" to={paths.streams}>View all</Link>
        </div>
        {isLoading ? <Spinner label="Loading live streams" /> : null}
        {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p> : null}
        {!isLoading && !error ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {streams.slice(0, 3).map((stream) => <StreamCard key={stream.id} stream={stream} />)}
          </div>
        ) : null}
      </section>
    </div>
  )
}
