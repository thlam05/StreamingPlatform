import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseMediaPlaybackOptions {
  containerRef: RefObject<HTMLDivElement | null>
  muted?: boolean
  sourceKind?: 'stream' | 'video'
  videoRef: RefObject<HTMLVideoElement | null>
}

export function useMediaPlayback({ containerRef, muted = true, sourceKind, videoRef }: UseMediaPlaybackOptions) {
  const lastVolumeRef = useRef(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      setIsPlaying(false)
      return
    }

    const player = video
    player.muted = muted
    setIsMuted(muted)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    function handlePlay() {
      setIsPlaying(true)
    }

    function handlePause() {
      setIsPlaying(false)
    }

    function handleVolumeChange() {
      setIsMuted(player.muted || player.volume === 0)
      setVolume(player.volume)
      if (player.volume > 0) lastVolumeRef.current = player.volume
    }

    function handleTimeUpdate() {
      setCurrentTime(player.currentTime)
    }

    function handleDurationChange() {
      setDuration(Number.isFinite(player.duration) ? player.duration : 0)
    }

    player.addEventListener('play', handlePlay)
    player.addEventListener('pause', handlePause)
    player.addEventListener('volumechange', handleVolumeChange)
    player.addEventListener('timeupdate', handleTimeUpdate)
    player.addEventListener('durationchange', handleDurationChange)

    return () => {
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('pause', handlePause)
      player.removeEventListener('volumechange', handleVolumeChange)
      player.removeEventListener('timeupdate', handleTimeUpdate)
      player.removeEventListener('durationchange', handleDurationChange)
    }
  }, [muted, sourceKind, videoRef])

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [containerRef])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      await video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return

    if (video.muted && video.volume === 0) {
      const restoredVolume = lastVolumeRef.current || 1
      video.volume = restoredVolume
      video.muted = false
      setVolume(restoredVolume)
      setIsMuted(false)
      return
    }

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function changeVolume(nextVolume: number) {
    const video = videoRef.current
    if (!video || !Number.isFinite(nextVolume)) return

    const clampedVolume = Math.min(1, Math.max(0, nextVolume))
    video.volume = clampedVolume
    video.muted = clampedVolume === 0
    setVolume(clampedVolume)
    setIsMuted(video.muted)
    if (clampedVolume > 0) lastVolumeRef.current = clampedVolume
  }

  function seek(nextTime: number) {
    const video = videoRef.current
    if (!video || sourceKind !== 'video' || !Number.isFinite(nextTime) || !Number.isFinite(video.duration)) return

    const clampedTime = Math.min(video.duration, Math.max(0, nextTime))
    video.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  async function toggleFullscreen() {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement === container) {
      await document.exitFullscreen().catch(() => undefined)
    } else {
      await container.requestFullscreen().catch(() => undefined)
    }
  }

  return {
    changeVolume,
    currentTime,
    duration,
    isFullscreen,
    isMuted,
    isPlaying,
    seek,
    toggleFullscreen,
    toggleMute,
    togglePlayback,
    volume,
  }
}
