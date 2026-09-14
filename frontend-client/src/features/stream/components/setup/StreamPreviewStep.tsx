import { CheckCircle2, CircleAlert, ExternalLink, Radio, Server } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { paths } from '../../../../routes/paths'
import { getApiErrorMessage } from '../../../../utils/error'
import { requestStreamStart } from '../../services/streamService'
import { useCredentialClipboard } from '../../hooks/useCredentialClipboard'
import { useStreamConnection } from '../../hooks/useStreamConnection'
import { useStreamCredentials } from '../../hooks/useStreamCredentials'
import type { StreamProvisionResponse } from '../../types/stream.types'
import { HlsPlayer } from '../player/HlsPlayer'
import { CredentialField } from './CredentialField'

interface StreamPreviewStepProps {
  onReset: () => void
  stream: StreamProvisionResponse
}

export function StreamPreviewStep({ onReset, stream }: StreamPreviewStepProps) {
  const credentials = useStreamCredentials(stream)
  const connection = useStreamConnection(stream.stream.id, true)
  const clipboard = useCredentialClipboard()
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  async function startLivestream() {
    setIsStarting(true)
    setStartError(null)
    try {
      await requestStreamStart(stream.stream.id)
    } catch (error) {
      setStartError(getApiErrorMessage(error, 'Unable to start the livestream.'))
    } finally {
      setIsStarting(false)
    }
  }

  const isLivestreamStarted = connection.streamStatus?.status === 'live'

  if (!credentials) return null

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/10 sm:p-8">
        <HlsPlayer
          poster={stream.stream.thumbnailUrl}
          src={connection.playbackUrl}
          title={`${stream.stream.title} preview`}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CredentialField
            copied={clipboard.copiedCredential === 'rtmpUrl'}
            name="rtmpUrl"
            onCopy={clipboard.handleCopy}
            value={credentials.rtmpUrl}
          />
          <CredentialField
            copied={clipboard.copiedCredential === 'streamKey'}
            name="streamKey"
            onCopy={clipboard.handleCopy}
            onToggleVisibility={clipboard.toggleStreamKeyVisibility}
            value={credentials.streamKey}
            visible={clipboard.streamKeyVisible}
          />
        </div>

        {clipboard.copyError ? (
          <p className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning" role="alert">
            {clipboard.copyError}
          </p>
        ) : null}
        {connection.connectionError ? (
          <p
            className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
            role="alert"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {connection.connectionError}
          </p>
        ) : null}
        {startError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {startError}
          </p>
        ) : null}

        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${connection.isConnected ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}`}
          role="status"
        >
          {connection.isConnected ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          ) : (
            <Radio
              aria-hidden="true"
              className={`mt-0.5 size-5 shrink-0 ${connection.isCheckingConnection ? 'animate-pulse' : ''}`}
            />
          )}
          <span>
            {isLivestreamStarted
              ? 'Your livestream is live.'
              : connection.streamStatus?.startRequested && connection.streamStatus.publisherObserved
                ? 'Start confirmed. Waiting for the player to become ready...'
                : connection.streamStatus?.startRequested
                  ? 'Start request sent. Waiting for your encoder to publish...'
                  : connection.streamStatus?.publisherObserved
                    ? 'Encoder connected. Press Start livestream to confirm.'
                    : connection.isCheckingConnection
                      ? 'Waiting for a connection from your encoder...'
                      : 'Connect your encoder with the credentials above.'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <Button
            disabled={
              isStarting ||
              isLivestreamStarted ||
              connection.streamStatus?.status === 'ended' ||
              connection.streamStatus?.status === 'cancelled'
            }
            onClick={startLivestream}
          >
            {isLivestreamStarted ? 'Livestream started' : isStarting ? 'Starting...' : 'Start livestream'}{' '}
            <Radio aria-hidden="true" className="size-4" />
          </Button>
          {isLivestreamStarted ? (
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-copy"
              to={paths.streams}
            >
              View streams <ExternalLink aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>

      <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
        <div className="flex items-center gap-2 text-brand">
          <Server aria-hidden="true" className="size-4" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">Encoder setup</p>
        </div>
        <h2 className="mt-3 text-lg font-semibold text-copy">Keep the stream key private</h2>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          Paste the RTMP URL and stream key into OBS or another supported encoder. We keep checking until the ingest
          service reports a live connection.
        </p>
        <Button className="mt-6 w-full" onClick={onReset} variant="secondary">
          Create another stream
        </Button>
      </aside>
    </section>
  )
}
