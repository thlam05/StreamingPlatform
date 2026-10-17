import type { HlsMediaSource, MediaVariant } from '../types/player.types'

interface LiveHlsUrls {
  playbackUrl?: string | null
  playbackUrl360p?: string | null
  playbackUrl720p?: string | null
}

export function createLiveHlsSource({
  playbackUrl,
  playbackUrl360p,
  playbackUrl720p,
}: LiveHlsUrls): HlsMediaSource | null {
  if (!playbackUrl) return null

  const variants: MediaVariant[] = [
    playbackUrl360p ? { label: '360p', quality: '360p', url: playbackUrl360p } : null,
    playbackUrl720p ? { label: '720p', quality: '720p', url: playbackUrl720p } : null,
  ].filter((variant): variant is MediaVariant => variant !== null)

  return {
    isLive: true,
    kind: 'stream',
    type: 'hls',
    url: playbackUrl,
    variants,
  }
}
