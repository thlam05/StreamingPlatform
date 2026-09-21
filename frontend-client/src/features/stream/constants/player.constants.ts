import type { QualityOption, SpeedOption } from '../types/player.types'

export const HLS_MIME_TYPE = 'application/vnd.apple.mpegurl'
export const AUTO_QUALITY = -1
export const CONTROLS_HIDE_DELAY = 2500

export const DEFAULT_QUALITY_OPTIONS: QualityOption[] = [{ label: 'Auto', level: AUTO_QUALITY }]

export const SPEED_OPTIONS: SpeedOption[] = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
]
