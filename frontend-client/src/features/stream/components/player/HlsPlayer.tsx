import Hls from 'hls.js'
import { useEffect, useRef, useState } from 'react'

import { cn } from '../../../../utils/cn'
import { HlsPlayerControls } from './HlsPlayerControls'

interface HlsPlayerProps {
  autoPlay?: boolean
  className?: string
  muted?: boolean
  poster?: string | null
  src?: string | null
  title?: string
}

function isHlsSource(src: string) {
  return /\.m3u8(?:$|[?#])/i.test(src)
}

export function HlsPlayer({ autoPlay = true, className, muted = true, poster, src, title }: HlsPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const player = video

    player.muted = muted

    function handlePlay() {
      setIsPlaying(true)
    }

    function handlePause() {
      setIsPlaying(false)
    }

    function handleVolumeChange() {
      setIsMuted(player.muted || player.volume === 0)
      setVolume(player.volume)
    }

    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)
    player.addEventListener('volumechange', handleVolumeChange)

    return () => {
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('pause', handlePause)
      player.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [muted])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === playerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (!isHlsSource(src) || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.load()

      return () => {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    }

    if (!Hls.isSupported()) return

    const hls = new Hls()
    hls.loadSource(src)
    hls.attachMedia(video)

    return () => {
      hls.destroy()
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video || !src) return

    if (video.paused) {
      await video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function handleVolumeChange(nextVolume: number) {
    const video = videoRef.current
    if (!video || !Number.isFinite(nextVolume)) return

    const clampedVolume = Math.min(1, Math.max(0, nextVolume))
    video.volume = clampedVolume
    video.muted = clampedVolume === 0
    setVolume(clampedVolume)
    setIsMuted(video.muted)
  }

  async function toggleFullscreen() {
    const player = playerRef.current
    if (!player) return

    if (document.fullscreenElement === player) {
      await document.exitFullscreen().catch(() => undefined)
    } else {
      await player.requestFullscreen().catch(() => undefined)
    }
  }

  return (
    <div
      className={cn(
        'group/player relative aspect-video overflow-hidden rounded-3xl border border-border bg-ink-900',
        className,
      )}
      ref={playerRef}
    >
      <video
        aria-label={title}
        autoPlay={autoPlay}
        className="h-full w-full object-contain"
        muted={muted}
        playsInline
        poster={poster ?? undefined}
        ref={videoRef}
      />
      <HlsPlayerControls
        disabled={!src}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        isPlaying={isPlaying}
        onFullscreen={toggleFullscreen}
        onToggleMute={toggleMute}
        onTogglePlayback={togglePlayback}
        onVolumeChange={handleVolumeChange}
        volume={volume}
      />
    </div>
  )
}
