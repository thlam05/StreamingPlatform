import { ArrowLeft, Clock3, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Spinner } from '../../components/ui/Spinner'
import { HlsPlayer } from '../../features/stream/components/player/HlsPlayer'
import { useStreams } from '../../features/stream/hooks/useStreams'
import { paths } from '../../routes/paths'

export function StreamDetailPage() {
  const { streamId } = useParams<{ streamId: string }>()
  const { error, isLoading, streams } = useStreams()
  const stream = streams.find((item) => item.id === streamId)

  if (isLoading) return <Spinner label="Loading stream" />
  if (error) return <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>
  if (!stream) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-8">
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="text-2xl font-semibold text-copy">Stream not found</h1>
        <Link className="inline-flex text-sm font-semibold text-brand hover:text-copy" to={paths.streams}>Back to streams</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-copy-muted hover:text-copy" to={paths.streams}>
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to streams
      </Link>
      {stream.playbackUrl ? (
        <HlsPlayer poster={stream.thumbnailUrl} src={stream.playbackUrl} title={`${stream.title} livestream`} />
      ) : (
        <section className={`relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br ${stream.gradientClass}`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur">Live preview</div>
          </div>
        </section>
      )}
      <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-sm font-semibold text-brand">{stream.category}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">{stream.title}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-copy-muted">{stream.description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-copy">{stream.creator}</p>
          <div className="mt-4 grid gap-3 text-sm text-copy-muted">
            <span className="inline-flex items-center gap-2"><Users className="size-4 text-brand" aria-hidden="true" />{stream.viewers.toLocaleString()} viewers</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-brand" aria-hidden="true" />{stream.duration} live</span>
          </div>
        </div>
      </section>
    </div>
  )
}
