import { useEffect, type RefObject } from 'react'

import type { VideoMediaSource } from '../../types/player.types'

interface VideoPlayerProps {
  autoPlay: boolean
  muted: boolean
  poster?: string | null
  source: VideoMediaSource
  title?: string
  videoRef: RefObject<HTMLVideoElement | null>
}

function resetVideo(video: HTMLVideoElement) {
  video.pause()
  video.removeAttribute('src')
  video.load()
}

export function VideoPlayer({ autoPlay, muted, poster, source, title, videoRef }: VideoPlayerProps) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.src = source.url
    video.load()

    return () => resetVideo(video)
  }, [source.url, videoRef])

  return (
    <video
      aria-label={title}
      autoPlay={autoPlay}
      className="h-full w-full object-contain"
      muted={muted}
      playsInline
      poster={poster ?? undefined}
      ref={videoRef}
    />
  )
}
