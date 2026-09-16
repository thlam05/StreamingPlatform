import { Clock3, Users } from 'lucide-react'

import type { Stream } from '../../types/stream.types'
import { StreamEngagementActions } from './StreamEngagementActions'
import { StreamGiftMenu } from './StreamGiftMenu'

interface StreamInfoPanelProps {
  engagementError?: string | null
  isAuthenticated: boolean
  isFollowing: boolean
  isLiked: boolean
  likeCount: number
  onFollow: () => void
  onLike: () => void
  isMutating?: boolean
  stream: Stream
}

export function StreamInfoPanel({
  engagementError,
  isAuthenticated,
  isFollowing,
  isLiked,
  isMutating,
  likeCount,
  onFollow,
  onLike,
  stream,
}: StreamInfoPanelProps) {
  const isLive = stream.status === 'live'
  const statusLabel = isLive
    ? 'Live now'
    : stream.status === 'ended'
      ? 'Ended'
      : stream.status === 'cancelled'
        ? 'Cancelled'
        : 'Preview'

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        <span className="inline-flex items-center gap-2">
          <span className={`size-2 rounded-full ${isLive ? 'bg-live' : 'bg-copy-muted'}`} aria-hidden="true" />
          {statusLabel}
        </span>
        <span className="text-copy-muted">/</span>
        <span>{stream.category}</span>
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-copy sm:text-3xl">{stream.title}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-copy-muted">{stream.description}</p>

      <div className="mt-6 flex flex-col gap-5 border-t border-border pt-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
            {stream.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-copy">{stream.creator}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-copy-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-brand" aria-hidden="true" />
                {stream.viewers.toLocaleString()} viewers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-brand" aria-hidden="true" />
                {isLive ? `${stream.duration} live` : statusLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StreamEngagementActions
            isAuthenticated={isAuthenticated}
            isFollowing={isFollowing}
            isLiked={isLiked}
            likeCount={likeCount}
            onFollow={onFollow}
            onLike={onLike}
            isMutating={isMutating}
          />
          <StreamGiftMenu isAuthenticated={isAuthenticated} />
        </div>
      </div>
      {engagementError ? <p className="mt-3 text-sm text-danger">{engagementError}</p> : null}
    </section>
  )
}
