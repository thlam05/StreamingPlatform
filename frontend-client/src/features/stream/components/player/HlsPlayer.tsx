import {
  Check,
  CircleAlert,
  LoaderCircle,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
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

interface QualityOption {
  label: string
  level: number
}

const HLS_MIME_TYPE = 'application/vnd.apple.mpegurl'
const AUTO_QUALITY = -1
const DEFAULT_QUALITY_OPTIONS: QualityOption[] = [{ label: 'Auto', level: AUTO_QUALITY }]

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00'

  const totalSeconds = Math.floor(value)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

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

    playableVideo.muted = muted
    playableVideo.addEventListener('loadedmetadata', handleReady)
    playableVideo.addEventListener('canplay', handleReady)
    playableVideo.addEventListener('error', handleVideoError)
    playableVideo.addEventListener('play', handlePlay)
    playableVideo.addEventListener('pause', handlePause)
    playableVideo.addEventListener('timeupdate', handleTimeUpdate)
    playableVideo.addEventListener('durationchange', handleDurationChange)
    playableVideo.addEventListener('volumechange', handleVolumeChange)

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

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value)
    if (!videoRef.current || !Number.isFinite(nextTime)) return
    videoRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value)
    if (!videoRef.current || !Number.isFinite(nextVolume)) return
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
    setIsSettingsOpen(false)
  }

  const effectivePlaybackState = src ? playbackState : 'unavailable'
  const isLoading = effectivePlaybackState === 'loading'
  const isUnavailable = effectivePlaybackState === 'unavailable'
  const hasError = effectivePlaybackState === 'error'
  const hasDuration = duration > 0

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

      {/* Player controls */}
      <div
        className="
    absolute inset-x-0 bottom-0 z-40
    bg-gradient-to-t
    from-black/90
    via-black/55
    to-transparent
    px-4 pb-3 pt-16
    text-white
  "
      >
        {/* Progress */}
        <div className="group/progress flex h-4 items-center">
          <label className="sr-only" htmlFor="hls-player-progress">
            Playback progress
          </label>

          <input
            aria-label="Playback progress"
            className="
        h-1 w-full
        cursor-pointer
        accent-brand
        transition-all
        duration-150
        group-hover/progress:h-1.5
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
            disabled={!hasDuration}
            id="hls-player-progress"
            max={duration || 1}
            min="0"
            onChange={handleSeek}
            step="0.1"
            type="range"
            value={Math.min(currentTime, duration || 1)}
          />
        </div>

        {/* Bottom controls */}
        <div className="flex h-10 items-center gap-1">
          {/* Play / Pause */}
          <button
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="
        grid size-10 shrink-0
        place-items-center
        rounded-lg
        text-white
        transition-colors
        hover:bg-white/10
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-white
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
            disabled={!src || isLoading || hasError || isUnavailable}
            onClick={() => void togglePlayback()}
            type="button"
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" aria-hidden="true" />
            ) : (
              <Play className="size-5 fill-current" aria-hidden="true" />
            )}
          </button>

          {/* Time */}
          <span
            className="
        mr-2
        whitespace-nowrap
        text-xs
        font-medium
        tabular-nums
        text-white/80
      "
          >
            {formatTime(currentTime)}
            <span className="mx-1 text-white/40">/</span>
            {formatTime(duration)}
          </span>

          {/* Volume */}
          <div className="group/volume flex items-center">
            <button
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="
          grid size-10 shrink-0
          place-items-center
          rounded-lg
          text-white
          transition-colors
          hover:bg-white/10
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-white
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
              disabled={!src || isLoading || hasError || isUnavailable}
              onClick={toggleMute}
              type="button"
            >
              {isMuted ? (
                <VolumeX className="size-5" aria-hidden="true" />
              ) : (
                <Volume2 className="size-5" aria-hidden="true" />
              )}
            </button>

            <div
              className="
          hidden
          w-0
          overflow-hidden
          opacity-0
          transition-[width,opacity]
          duration-200

          sm:block
          sm:group-hover/volume:w-20
          sm:group-hover/volume:opacity-100
          sm:group-focus-within/volume:w-20
          sm:group-focus-within/volume:opacity-100
        "
            >
              <label className="sr-only" htmlFor="hls-player-volume">
                Volume
              </label>

              <input
                aria-label="Volume"
                className="
            h-1 w-16
            cursor-pointer
            accent-white
          "
                id="hls-player-volume"
                max="1"
                min="0"
                onChange={handleVolumeChange}
                step="0.05"
                type="range"
                value={isMuted ? 0 : volume}
              />
            </div>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-1">
            {/* Settings */}
            <div className="relative">
              <button
                aria-expanded={isSettingsOpen}
                aria-haspopup="menu"
                aria-label="Player settings"
                className="
            grid size-10
            place-items-center
            rounded-lg
            text-white
            transition-colors
            hover:bg-white/10
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                disabled={!src || isLoading || hasError || isUnavailable}
                onClick={() => setIsSettingsOpen((open) => !open)}
                type="button"
              >
                <Settings2 className="size-5" aria-hidden="true" />
              </button>

              {isSettingsOpen ? (
                <div
                  aria-label="Video quality"
                  className="
              absolute bottom-12 right-0
              w-40
              overflow-hidden
              rounded-xl
              border border-white/10
              bg-ink-950/95
              p-1.5
              text-white
              shadow-2xl
              backdrop-blur-xl
            "
                  role="menu"
                >
                  <div className="px-2.5 pb-1.5 pt-2">
                    <p className="text-xs font-semibold text-white">Quality</p>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="mt-1">
                    {qualityOptions.map((option) => (
                      <button
                        className={cn(
                          `
                      flex w-full
                      items-center
                      justify-between
                      rounded-lg
                      px-2.5 py-2
                      text-left
                      text-xs
                      font-medium
                      transition-colors
                      hover:bg-white/10
                      focus-visible:outline-none
                    `,
                          qualityLevel === option.level ? 'text-white' : 'text-white/70',
                        )}
                        key={option.level}
                        onClick={() => handleQualityChange(option.level)}
                        role="menuitemradio"
                        type="button"
                      >
                        <span>{option.label}</span>

                        {qualityLevel === option.level ? (
                          <Check className="size-4 text-brand" aria-hidden="true" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Fullscreen */}
            <button
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="
          grid size-10
          place-items-center
          rounded-lg
          text-white
          transition-colors
          hover:bg-white/10
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-white
        "
              onClick={() => void toggleFullscreen()}
              type="button"
            >
              {isFullscreen ? (
                <Minimize className="size-5" aria-hidden="true" />
              ) : (
                <Maximize className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

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
