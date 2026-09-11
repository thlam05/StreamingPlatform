import { CircleAlert, LoaderCircle, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type Hls from 'hls.js'

import { cn } from '../../../../utils/cn'

interface HlsPlayerProps {
  autoPlay?: boolean
  className?: string
  muted?: boolean
  poster?: string | null
  src?: string | null
  title?: string
}

type PlaybackState = 'error' | 'loading' | 'ready' | 'unavailable'

const HLS_MIME_TYPE = 'application/vnd.apple.mpegurl'

export function HlsPlayer({
  autoPlay = true,
  className,
  muted = true,
  poster,
  src,
  title = 'Live stream',
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>(src ? 'loading' : 'unavailable')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return
    const playableVideo = videoElement as HTMLVideoElement

    if (!src) {
      return
    }

    let hls: Hls | null = null
    let recoveredMediaError = false
    let isCancelled = false
    let unsupportedTimer: number | undefined

    function handleReady() {
      if (isCancelled) return
      setPlaybackState('ready')
      if (autoPlay) void playableVideo.play().catch(() => undefined)
    }

    function handleVideoError() {
      if (isCancelled) return
      setPlaybackState('error')
      setErrorMessage('The video could not be loaded. Check the stream and try again.')
    }

    playableVideo.addEventListener('loadedmetadata', handleReady)
    playableVideo.addEventListener('error', handleVideoError)

    if (playableVideo.canPlayType(HLS_MIME_TYPE)) {
      playableVideo.src = src
      playableVideo.load()
    } else {
      void import('hls.js').then(({ default: HlsLibrary }) => {
        if (isCancelled) return

        if (!HlsLibrary.isSupported()) {
          unsupportedTimer = window.setTimeout(() => {
            if (isCancelled) return
            setPlaybackState('error')
            setErrorMessage('This browser does not support HLS playback.')
          }, 0)
          return
        }

        hls = new HlsLibrary({
          backBufferLength: 90,
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(src)
        hls.attachMedia(playableVideo)
        hls.on(HlsLibrary.Events.MANIFEST_PARSED, handleReady)
        hls.on(HlsLibrary.Events.ERROR, (_event, data) => {
          if (isCancelled || !data.fatal) return

          if (data.type === HlsLibrary.ErrorTypes.MEDIA_ERROR && !recoveredMediaError) {
            recoveredMediaError = true
            hls?.recoverMediaError()
            return
          }

          setPlaybackState('error')
          setErrorMessage('The livestream is unavailable right now. Check the stream and try again.')
        })
      }).catch(() => {
        if (isCancelled) return
        setPlaybackState('error')
        setErrorMessage('The HLS player could not be loaded. Try again.')
      })
    }

    return () => {
      isCancelled = true
      if (unsupportedTimer !== undefined) window.clearTimeout(unsupportedTimer)
      playableVideo.removeEventListener('loadedmetadata', handleReady)
      playableVideo.removeEventListener('error', handleVideoError)
      hls?.destroy()
      playableVideo.pause()
      playableVideo.removeAttribute('src')
      playableVideo.load()
    }
  }, [autoPlay, retryCount, src])

  const effectivePlaybackState = src ? playbackState : 'unavailable'
  const isLoading = effectivePlaybackState === 'loading'
  const isUnavailable = effectivePlaybackState === 'unavailable'
  const hasError = effectivePlaybackState === 'error'

  return (
    <div
      aria-busy={isLoading}
      aria-label={title}
      className={cn('relative aspect-video overflow-hidden rounded-3xl border border-border bg-ink-900', className)}
      role="region"
    >
      <video
        autoPlay={autoPlay}
        className="h-full w-full object-contain"
        controls
        muted={muted}
        playsInline
        poster={poster ?? undefined}
        ref={videoRef}
      />

      {isLoading ? (
        <div className="absolute inset-0 grid place-items-center bg-ink-900/85 p-6 text-center" role="status">
          <div className="grid justify-items-center gap-3 text-sm text-copy-muted">
            <LoaderCircle className="size-6 animate-spin text-brand" aria-hidden="true" />
            <span>Connecting to the livestream...</span>
          </div>
        </div>
      ) : null}

      {isUnavailable || hasError ? (
        <div className="absolute inset-0 grid place-items-center bg-ink-900/90 p-6 text-center">
          <div className="grid max-w-sm justify-items-center gap-3">
            {isUnavailable ? <Play className="size-7 text-copy-muted" aria-hidden="true" /> : <CircleAlert className="size-7 text-warning" aria-hidden="true" />}
            <p className="font-semibold text-copy">{isUnavailable ? 'Playback is not available' : 'Playback failed'}</p>
            <p className="text-sm leading-6 text-copy-muted">{isUnavailable ? 'This stream does not have an active HLS playback URL yet.' : errorMessage}</p>
            {hasError ? (
              <button
                className="mt-1 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-semibold text-copy transition-colors hover:border-brand/60 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98]"
                onClick={() => {
                  setPlaybackState('loading')
                  setErrorMessage(null)
                  setRetryCount((count) => count + 1)
                }}
                type="button"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Retry playback
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
