export interface HlsMediaSource {
  isLive?: boolean
  kind: 'stream'
  type: 'hls'
  url: string
  variants?: MediaVariant[]
}

export type PlaybackQuality = 'source' | '360p' | '480p' | '720p' | '1080p'

export interface MediaVariant {
  label: string
  quality: Exclude<PlaybackQuality, 'source'>
  url: string
}

export interface VideoMediaSource {
  kind: 'video'
  mimeType?: string
  type: 'video'
  url: string
}

export type MediaSource = HlsMediaSource | VideoMediaSource

export interface QualityOption {
  label: string
  level: number
}

export interface SpeedOption {
  label: string
  value: number
}
