export interface HlsMediaSource {
  isLive?: boolean
  kind: 'stream'
  type: 'hls'
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
