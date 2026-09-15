import { ArrowLeft, CircleAlert, MessageSquare, Radio, StopCircle, Users } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { cancelStream } from '../../features/stream/services/streamService'
import { useStreamConnection } from '../../features/stream/hooks/useStreamConnection'
import { paths } from '../../routes/paths'
import { getApiErrorMessage } from '../../utils/error'
import { HlsPlayer } from '../../features/stream/components/player/HlsPlayer'

function getStatusLabel(status: string | undefined, startRequested: boolean) {
  if (status === 'live') return 'Live'
  if (status === 'ended') return 'Ended'
  if (status === 'cancelled') return 'Cancelled'
  if (startRequested) return 'Starting'
  if (status === 'preview') return 'Preview'
  return 'Connecting'
}

export function LivestreamDashboardPage() {
  const { streamId } = useParams<{ streamId: string }>()
  const navigate = useNavigate()
  const connection = useStreamConnection(streamId ?? null, Boolean(streamId))
  const [isEnding, setIsEnding] = useState(false)
  const [endError, setEndError] = useState<string | null>(null)

  const status = connection.streamStatus

  useEffect(() => {
    if (streamId && (status?.status === 'ended' || status?.status === 'cancelled')) {
      navigate(paths.studioStreamSummary(streamId), { replace: true })
    }
  }, [navigate, status?.status, streamId])

  if (!streamId) return <p className="text-sm text-danger">Stream id is missing.</p>

  const currentStreamId = streamId
  const statusLabel = getStatusLabel(status?.status, Boolean(status?.startRequested))
  const isLive = status?.status === 'live'
  const isTerminal = status?.status === 'ended' || status?.status === 'cancelled'

  async function handleEndStream() {
    if (!isLive || !window.confirm('End this livestream?')) return

    setIsEnding(true)
    setEndError(null)
    try {
      await cancelStream(currentStreamId)
      navigate(paths.studioStreamSummary(currentStreamId), { replace: true })
    } catch (error) {
      setEndError(getApiErrorMessage(error, 'Unable to end the livestream.'))
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-copy-muted hover:text-copy"
          to={paths.studio}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Studio
        </Link>
        <Button disabled={!isLive || isEnding} isLoading={isEnding} onClick={handleEndStream} variant="secondary">
          <StopCircle aria-hidden="true" className="size-4" />
          End stream
        </Button>
      </div>

      {connection.isCheckingConnection && !status ? <Spinner label="Loading livestream dashboard" /> : null}

      {connection.connectionError ? (
        <div
          className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
          role="alert"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {connection.connectionError}
          <button className="ml-auto font-semibold underline" onClick={connection.retry} type="button">
            Retry
          </button>
        </div>
      ) : null}

      {endError ? (
        <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger" role="alert">
          {endError}
        </p>
      ) : null}

      {status ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
                <Radio aria-hidden="true" className="size-4" />
                {statusLabel}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-copy">{status.title}</h1>
              <p className="mt-2 text-sm text-copy-muted">
                {status.startRequested && !isLive
                  ? 'Your start request was accepted. We are waiting for the livestream to become live.'
                  : isTerminal
                    ? 'This livestream has ended.'
                    : 'Monitor your broadcast from this dashboard.'}
              </p>
            </div>
            <span
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${isLive ? 'border-success/30 bg-success/10 text-success' : 'border-brand/30 bg-brand/10 text-brand'}`}
            >
              <span aria-hidden="true" className="mr-1.5">
                ●
              </span>
              {statusLabel}
            </span>
          </div>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <HlsPlayer poster={status.thumbnailUrl} src={connection.playbackUrl} title={`${status.title} livestream`} />
            <aside className="space-y-4 rounded-3xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2 text-copy-muted">
                <Users aria-hidden="true" className="size-4 text-brand" />
                <span className="text-sm">Viewers</span>
                <strong className="ml-auto text-copy">{(status.viewerCount ?? 0).toLocaleString()}</strong>
              </div>
              <div className="flex items-center gap-2 text-copy-muted">
                <Radio aria-hidden="true" className="size-4 text-brand" />
                <span className="text-sm">Playback</span>
                <strong className="ml-auto text-copy">{connection.playbackUrl ? 'Ready' : 'Waiting'}</strong>
              </div>
              <p className="border-t border-border pt-4 text-sm leading-6 text-copy-muted">
                Keep this dashboard open while you broadcast. Status and playback update automatically.
              </p>
            </aside>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-border bg-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Stream details</p>
              <h2 className="mt-3 text-lg font-semibold text-copy">{status.title}</h2>
              <p className="mt-2 text-sm leading-6 text-copy-muted">{status.description || 'No description added.'}</p>
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
        </>
      ) : null}
    </div>
  )
}
