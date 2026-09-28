import { useRef } from 'react'

import { cn } from '../../../../utils/cn'
import { useMediaPlayback } from '../../hooks/player/useMediaPlayback'
import type { MediaSource } from '../../types/player.types'
import { HlsPlayer } from './HlsPlayer'
import { MediaPlayerControls } from './MediaPlayerControls'
import { VideoPlayer } from './VideoPlayer'

export interface MediaPlayerProps {
  autoPlay?: boolean
  className?: string
  muted?: boolean
  poster?: string | null
  source?: MediaSource | null
  title?: string
}

export function MediaPlayer({ autoPlay = true, className, muted = true, poster, source, title }: MediaPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playback = useMediaPlayback({
    containerRef: playerRef,
    muted,
    sourceKind: source?.kind,
    videoRef,
  })

  const player =
    source?.kind === 'stream' ? (
      <HlsPlayer
        autoPlay={autoPlay}
        muted={playback.isMuted}
        poster={poster}
        source={source}
        title={title}
        videoRef={videoRef}
      />
    ) : source?.kind === 'video' ? (
      <VideoPlayer
        autoPlay={autoPlay}
        muted={playback.isMuted}
        poster={poster}
        source={source}
        title={title}
        videoRef={videoRef}
      />
    ) : null

  return (
    <div
      className={cn(
        'group/player relative aspect-video overflow-hidden rounded-3xl border border-border bg-ink-900',
        className,
      )}
      ref={playerRef}
    >
      {player}
      <MediaPlayerControls
        currentTime={playback.currentTime}
        disabled={!source}
        duration={playback.duration}
        isFullscreen={playback.isFullscreen}
        isMuted={playback.isMuted}
        isPlaying={playback.isPlaying}
        onFullscreen={playback.toggleFullscreen}
        onSeek={playback.seek}
        onToggleMute={playback.toggleMute}
        onTogglePlayback={playback.togglePlayback}
        onVolumeChange={playback.changeVolume}
        showTimeline={source?.kind === 'video'}
        volume={playback.volume}
      />
    </div>
  )
}
