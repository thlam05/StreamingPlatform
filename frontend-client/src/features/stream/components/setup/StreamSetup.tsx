import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '../../../../components/ui/Spinner'
import { paths } from '../../../../routes/paths'
import { getApiErrorMessage } from '../../../../utils/error'
import { getStreamStatus } from '../../services/streamService'
import type { StreamProvisionResponse, StreamSetupStep } from '../../types/stream.types'
import { useStreamSetup } from '../../hooks/useStreamSetup'
import { StreamSetupContent } from './StreamSetupContent'
import { StreamSetupSteps } from './StreamSetupSteps'

export function StreamSetup() {
  const setup = useStreamSetup()
  const navigate = useNavigate()
  const location = useLocation()
  const { streamId } = useParams<{ streamId: string }>()
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!streamId) {
      return
    }

    let isMounted = true
    const state = location.state as { phase?: StreamSetupStep; provision?: StreamProvisionResponse } | null

    if (state?.provision?.stream.id === streamId) {
      setup.initializeExisting(state.provision, state.phase ?? 'thumbnail')
      return () => {
        isMounted = false
      }
    }

    getStreamStatus(streamId)
      .then((status) => {
        if (!isMounted) return
        if (status.status === 'live') {
          navigate(paths.studioStreamDashboard(streamId), { replace: true })
          return
        }
        if (status.status === 'ended' || status.status === 'cancelled') {
          navigate(paths.studioStreamSummary(streamId), { replace: true })
          return
        }

        setup.initializeExisting(
          {
            stream: {
              id: status.id,
              title: status.title,
              status: status.status,
              thumbnailUrl: status.thumbnailUrl,
              playbackUrl: status.playbackUrl,
            },
            rtmpUrl: null,
            streamKey: null,
          },
          'preview',
        )
        setLoadError(null)
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setLoadError(getApiErrorMessage(error, 'Unable to load this stream setup.'))
      })

    return () => {
      isMounted = false
    }
    // The setup controller is intentionally used for this route initialization only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate, streamId])

  function handleCredentialsCreated(createdStream: StreamProvisionResponse) {
    if (streamId) {
      setup.handleCredentialsCreated(createdStream)
      return
    }

    navigate(paths.studioStreamSetup(createdStream.stream.id), {
      replace: true,
      state: { phase: 'thumbnail', provision: createdStream },
    })
  }

  const isLoadingExisting = Boolean(streamId && !setup.stream && !loadError)

  if (isLoadingExisting) return <Spinner label="Loading stream setup" />

  if (loadError) {
    return (
      <div className="space-y-4 rounded-2xl border border-danger/30 bg-danger/10 p-6 text-danger">
        <p role="alert">{loadError}</p>
        <Link className="inline-flex text-sm font-semibold underline" to={paths.studio}>
          Back to Studio
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand">Creator studio</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-copy-muted hover:text-copy sm:self-auto"
          to={paths.studio}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to streams
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/5 sm:p-6">
        <div className="mb-5 border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{setup.phase.label}</p>
          <h2 className="mt-1 text-lg font-semibold text-copy">{setup.phase.title}</h2>
          <p className="mt-1 text-sm text-copy-muted">{setup.phase.description}</p>
        </div>
        <StreamSetupSteps phase={setup.phase} />
      </div>

      <StreamSetupContent
        onCredentialsCreated={handleCredentialsCreated}
        onReset={() => navigate(paths.studioStreamCreate)}
        onThumbnailSkipped={setup.handleThumbnailSkipped}
        onThumbnailUploaded={setup.handleThumbnailUploaded}
        phase={setup.phase}
        stream={setup.stream}
      />
    </div>
  )
}
