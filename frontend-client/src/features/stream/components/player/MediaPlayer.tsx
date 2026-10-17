import { useMemo, useRef, useState } from 'react'

import { cn } from '../../../../utils/cn'
import { useMediaPlayback } from '../../hooks/player/useMediaPlayback'
import type { MediaSource, PlaybackQuality } from '../../types/player.types'
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
  const [qualityState, setQualityState] = useState<{ quality: PlaybackQuality; sourceUrl?: string }>({
    quality: 'source',
    sourceUrl: source?.url,
  })
  const quality = qualityState.sourceUrl === source?.url ? qualityState.quality : 'source'

  const activeSource = useMemo<MediaSource | null | undefined>(() => {
    if (source?.kind !== 'stream' || quality === 'source') return source

    const selectedVariant = source.variants?.find((variant) => variant.quality === quality)
    return selectedVariant ? { ...source, url: selectedVariant.url } : source
  }, [quality, source])

  const qualityOptions = useMemo(
    () => [
      { label: 'Original', quality: 'source' as const },
      ...(source?.kind === 'stream'
        ? (source.variants?.map((variant) => ({ label: variant.label, quality: variant.quality })) ?? [])
        : []),
    ],
    [source],
  )

  const playback = useMediaPlayback({
    containerRef: playerRef,
    isLive: activeSource?.kind === 'stream' && activeSource.isLive === true,
    muted,
    sourceKind: activeSource?.kind,
    sourceUrl: activeSource?.url,
    videoRef,
  })

  const player =
    activeSource?.kind === 'stream' ? (
      <HlsPlayer
        autoPlay={autoPlay}
        muted={playback.isMuted}
        poster={poster}
        source={activeSource}
        title={title}
        videoRef={videoRef}
      />
    ) : activeSource?.kind === 'video' ? (
      <VideoPlayer
        autoPlay={autoPlay}
        muted={playback.isMuted}
        poster={poster}
        source={activeSource}
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
        disabled={!activeSource}
        duration={playback.duration}
        isFullscreen={playback.isFullscreen}
        isMuted={playback.isMuted}
        isPlaying={playback.isPlaying}
        onFullscreen={playback.toggleFullscreen}
        onPlaybackRateChange={playback.changePlaybackRate}
        onSeek={playback.seek}
        onToggleMute={playback.toggleMute}
        onTogglePlayback={playback.togglePlayback}
        onVolumeChange={playback.changeVolume}
        playbackRate={playback.playbackRate}
        quality={quality}
        qualityOptions={qualityOptions}
        onQualityChange={(nextQuality) => setQualityState({ quality: nextQuality, sourceUrl: source?.url })}
        showTimeline={activeSource?.kind === 'video'}
        volume={playback.volume}
      />
    </div>
  )
}
