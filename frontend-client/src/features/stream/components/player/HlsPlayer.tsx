import { CircleAlert, LoaderCircle, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type Hls from 'hls.js'

import { cn } from '../../../../utils/cn'
import { HlsPlayerControls, type QualityOption } from './HlsPlayerControls'

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
const AUTO_QUALITY = -1
const DEFAULT_QUALITY_OPTIONS: QualityOption[] = [{ label: 'Auto', level: AUTO_QUALITY }]

function getQualityOptions(hls: Hls): QualityOption[] {
  const seenLabels = new Set<string>()
  const levels = hls.levels
    .map((level, index) => ({
      height: level.height,
      label: level.height ? `${level.height}p` : `Level ${index + 1}`,
      level: index,
    }))
    .sort((first, second) => second.height - first.height)
    .filter((option) => {
      if (seenLabels.has(option.label)) return false
      seenLabels.add(option.label)
      return true
    })

  return [DEFAULT_QUALITY_OPTIONS[0], ...levels]
}

export function HlsPlayer({
  autoPlay = true,
  className,
  muted = true,
  poster,
  src,
  title = 'Live stream',
}: HlsPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>(src ? 'loading' : 'unavailable')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [qualityLevel, setQualityLevel] = useState(AUTO_QUALITY)
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>(DEFAULT_QUALITY_OPTIONS)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return
    const playableVideo = videoElement as HTMLVideoElement

    setPlaybackState(src ? 'loading' : 'unavailable')
    setErrorMessage(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setQualityLevel(AUTO_QUALITY)
    setQualityOptions(DEFAULT_QUALITY_OPTIONS)
    setPlaybackRate(1)

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

    function handlePlay() {
      setIsPlaying(true)
    }

    function handlePause() {
      setIsPlaying(false)
    }

    function handleTimeUpdate() {
      setCurrentTime(playableVideo.currentTime)
    }

    function handleDurationChange() {
      setDuration(Number.isFinite(playableVideo.duration) ? playableVideo.duration : 0)
    }

    function handleVolumeChange() {
      setVolume(playableVideo.volume)
      setIsMuted(playableVideo.muted || playableVideo.volume === 0)
    }

    function handleRateChange() {
      setPlaybackRate(playableVideo.playbackRate)
    }

    playableVideo.muted = muted
    playableVideo.playbackRate = 1
    playableVideo.addEventListener('loadedmetadata', handleReady)
    playableVideo.addEventListener('canplay', handleReady)
    playableVideo.addEventListener('error', handleVideoError)
    playableVideo.addEventListener('play', handlePlay)
    playableVideo.addEventListener('pause', handlePause)
    playableVideo.addEventListener('timeupdate', handleTimeUpdate)
    playableVideo.addEventListener('durationchange', handleDurationChange)
    playableVideo.addEventListener('volumechange', handleVolumeChange)
    playableVideo.addEventListener('ratechange', handleRateChange)

    let hls: Hls | null = null
    let recoveredMediaError = false
    let isCancelled = false
    let unsupportedTimer: number | undefined

    if (!src) {
      return () => {
        playableVideo.removeEventListener('loadedmetadata', handleReady)
        playableVideo.removeEventListener('canplay', handleReady)
        playableVideo.removeEventListener('error', handleVideoError)
        playableVideo.removeEventListener('play', handlePlay)
        playableVideo.removeEventListener('pause', handlePause)
        playableVideo.removeEventListener('timeupdate', handleTimeUpdate)
        playableVideo.removeEventListener('durationchange', handleDurationChange)
        playableVideo.removeEventListener('volumechange', handleVolumeChange)
        playableVideo.removeEventListener('ratechange', handleRateChange)
      }
    }

    if (playableVideo.canPlayType(HLS_MIME_TYPE)) {
      playableVideo.src = src
      playableVideo.load()
    } else {
      void import('hls.js')
        .then(({ default: HlsLibrary }) => {
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
          hlsRef.current = hls
          hls.loadSource(src)
          hls.attachMedia(playableVideo)
          hls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
            if (!hls || isCancelled) return
            setQualityOptions(getQualityOptions(hls))
            handleReady()
          })
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
        })
        .catch(() => {
          if (isCancelled) return
          setPlaybackState('error')
          setErrorMessage('The HLS player could not be loaded. Try again.')
        })
    }

    return () => {
      isCancelled = true
      if (unsupportedTimer !== undefined) window.clearTimeout(unsupportedTimer)
      playableVideo.removeEventListener('loadedmetadata', handleReady)
      playableVideo.removeEventListener('canplay', handleReady)
      playableVideo.removeEventListener('error', handleVideoError)
      playableVideo.removeEventListener('play', handlePlay)
      playableVideo.removeEventListener('pause', handlePause)
      playableVideo.removeEventListener('timeupdate', handleTimeUpdate)
      playableVideo.removeEventListener('durationchange', handleDurationChange)
      playableVideo.removeEventListener('volumechange', handleVolumeChange)
      playableVideo.removeEventListener('ratechange', handleRateChange)
      hls?.destroy()
      hlsRef.current = null
      playableVideo.pause()
      playableVideo.removeAttribute('src')
      playableVideo.load()
    }
  }, [autoPlay, muted, retryCount, src])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === playerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  async function togglePlayback() {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (videoElement.paused) {
      await videoElement.play().catch(() => undefined)
    } else {
      videoElement.pause()
    }
  }

  function handleSeek(nextTime: number) {
    if (!videoRef.current) return
    videoRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function handleVolumeChange(nextVolume: number) {
    if (!videoRef.current) return
    videoRef.current.volume = nextVolume
    videoRef.current.muted = nextVolume === 0
    setVolume(nextVolume)
    setIsMuted(nextVolume === 0)
  }

  function toggleMute() {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (videoElement.muted || videoElement.volume === 0) {
      videoElement.muted = false
      videoElement.volume = volume || 0.7
      setIsMuted(false)
      return
    }

    videoElement.muted = true
    setIsMuted(true)
  }

  async function toggleFullscreen() {
    if (!playerRef.current) return

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined)
      return
    }

    await playerRef.current.requestFullscreen().catch(() => undefined)
  }

  function handleQualityChange(level: number) {
    if (hlsRef.current) hlsRef.current.currentLevel = level
    setQualityLevel(level)
  }

  function handleSpeedChange(rate: number) {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const effectivePlaybackState = src ? playbackState : 'unavailable'
  const isLoading = effectivePlaybackState === 'loading'
  const isUnavailable = effectivePlaybackState === 'unavailable'
  const hasError = effectivePlaybackState === 'error'

  return (
    <div
      aria-busy={isLoading}
      aria-label={title}
      className={cn('relative aspect-video overflow-hidden rounded-3xl border border-border bg-ink-900', className)}
      ref={playerRef}
      role="region"
    >
      <video
        autoPlay={autoPlay}
        className="h-full w-full cursor-pointer object-contain"
        muted={isMuted}
        onClick={() => void togglePlayback()}
        onDoubleClick={() => void toggleFullscreen()}
        playsInline
        poster={poster ?? undefined}
        ref={videoRef}
      />

      <HlsPlayerControls
        currentTime={currentTime}
        duration={duration}
        hasError={hasError}
        isFullscreen={isFullscreen}
        isLoading={isLoading}
        isMuted={isMuted}
        isPlaying={isPlaying}
        isSettingsOpen={isSettingsOpen}
        onFullscreen={toggleFullscreen}
        onQualityChange={handleQualityChange}
        onSeek={handleSeek}
        onSpeedChange={handleSpeedChange}
        onToggleMute={toggleMute}
        onTogglePlayback={togglePlayback}
        onToggleSettings={() => setIsSettingsOpen((open) => !open)}
        onVolumeChange={handleVolumeChange}
        playbackRate={playbackRate}
        qualityLevel={qualityLevel}
        qualityOptions={qualityOptions}
        src={src}
        volume={volume}
      />

      {isLoading ? (
        <div
          className="absolute inset-x-0 bottom-20 top-0 z-30 grid place-items-center bg-ink-900/85 p-6 text-center"
          role="status"
        >
          <div className="grid justify-items-center gap-3 text-sm text-copy-muted">
            <LoaderCircle className="size-6 animate-spin text-brand" aria-hidden="true" />
            <span>Connecting to the livestream...</span>
          </div>
        </div>
      ) : null}

      {isUnavailable || hasError ? (
        <div className="absolute inset-0 z-30 grid place-items-center bg-ink-900/90 p-6 text-center">
          <div className="grid max-w-sm justify-items-center gap-3">
            {isUnavailable ? (
              <Play className="size-7 text-copy-muted" aria-hidden="true" />
            ) : (
              <CircleAlert className="size-7 text-warning" aria-hidden="true" />
            )}
            <p className="font-semibold text-copy">{isUnavailable ? 'Playback is not available' : 'Playback failed'}</p>
            <p className="text-sm leading-6 text-copy-muted">
              {isUnavailable ? 'This stream does not have an active HLS playback URL yet.' : errorMessage}
            </p>
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
