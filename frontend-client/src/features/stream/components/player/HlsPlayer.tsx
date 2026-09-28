import Hls from 'hls.js'
import { useEffect, type RefObject } from 'react'

import { HLS_MIME_TYPE } from '../../constants/player.constants'
import type { HlsMediaSource } from '../../types/player.types'

interface HlsPlayerProps {
  autoPlay: boolean
  muted: boolean
  poster?: string | null
  source: HlsMediaSource
  title?: string
  videoRef: RefObject<HTMLVideoElement | null>
}

function resetVideo(video: HTMLVideoElement) {
  video.pause()
  video.removeAttribute('src')
  video.load()
}

export function HlsPlayer({ autoPlay, muted, poster, source, title, videoRef }: HlsPlayerProps) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (video.canPlayType(HLS_MIME_TYPE)) {
      video.src = source.url
      video.load()

      return () => resetVideo(video)
    }

    if (!Hls.isSupported()) return

    const hls = new Hls()
    hls.loadSource(source.url)
    hls.attachMedia(video)

    return () => {
      hls.destroy()
      resetVideo(video)
    }
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
