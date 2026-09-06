import { Clock3, Play, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../../../routes/paths'
import type { Stream } from '../../types/stream.types'

interface StreamCardProps {
  stream: Stream
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10">
      <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${stream.gradientClass}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_32%)]" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between text-xs font-semibold text-white/80">
          <span className="rounded-full bg-black/20 px-2.5 py-1 backdrop-blur">LIVE</span>
          <span className="rounded-full bg-black/20 px-2.5 py-1 backdrop-blur">{stream.category}</span>
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid size-14 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition-transform group-hover:scale-110">
            <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-xs font-medium text-white/85">
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" aria-hidden="true" />{stream.viewers.toLocaleString()}</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />{stream.duration}</span>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
            {stream.initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-copy">{stream.title}</h3>
            <p className="mt-1 text-sm text-copy-muted">{stream.creator}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-copy-muted">{stream.description}</p>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-copy"
          to={paths.streamDetail(stream.id)}
        >
          Watch stream <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
