import { Check, Maximize, Minimize, Pause, Play, Settings2, Volume2, VolumeX } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'

import { cn } from '../../../../utils/cn'

export interface QualityOption {
  label: string
  level: number
}

interface SpeedOption {
  label: string
  value: number
}

export interface HlsPlayerControlsProps {
  currentTime: number
  duration: number
  hasError: boolean
  isFullscreen: boolean
  isLoading: boolean
  isMuted: boolean
  isPlaying: boolean
  isSettingsOpen: boolean
  playbackRate: number
  qualityLevel: number
  qualityOptions: QualityOption[]
  src?: string | null
  volume: number
  onFullscreen: () => void | Promise<void>
  onQualityChange: (level: number) => void
  onSeek: (time: number) => void
  onSpeedChange: (rate: number) => void
  onToggleMute: () => void
  onTogglePlayback: () => void | Promise<void>
  onToggleSettings: () => void
  onVolumeChange: (nextVolume: number) => void
}

const SPEED_OPTIONS: SpeedOption[] = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
]

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00'

  const totalSeconds = Math.floor(value)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function HlsPlayerControls({
  currentTime,
  duration,
  hasError,
  isFullscreen,
  isLoading,
  isMuted,
  isPlaying,
  isSettingsOpen,
  onFullscreen,
  onQualityChange,
  onSeek,
  onSpeedChange,
  onToggleMute,
  onTogglePlayback,
  onToggleSettings,
  onVolumeChange,
  playbackRate,
  qualityLevel,
  qualityOptions,
  src,
  volume,
}: HlsPlayerControlsProps) {
  const [isVolumeControlVisible, setIsVolumeControlVisible] = useState(false)
  const hasDuration = duration > 0
  const isPlaybackDisabled = !src || isLoading || hasError

  function handleSeek(event: ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value)
    if (Number.isFinite(nextTime)) onSeek(nextTime)
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = Number(event.target.value)
    if (Number.isFinite(nextVolume)) onVolumeChange(nextVolume)
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-3 pt-16 text-white"
      onMouseLeave={() => setIsVolumeControlVisible(false)}
    >
      <div className="group/progress flex h-4 items-center">
        <label className="sr-only" htmlFor="hls-player-progress">
          Playback progress
        </label>
        <input
          aria-label="Playback progress"
          className="h-1 w-full cursor-pointer accent-brand transition-all duration-150 group-hover/progress:h-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasDuration}
          id="hls-player-progress"
          max={duration || 1}
          min="0"
          onChange={handleSeek}
          step="0.1"
          type="range"
          value={Math.min(currentTime, duration || 1)}
        />
      </div>

      <div className="flex h-10 items-center gap-1">
        <button
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isPlaybackDisabled}
          onClick={() => void onTogglePlayback()}
          type="button"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" aria-hidden="true" />
          ) : (
            <Play className="size-5 fill-current" aria-hidden="true" />
          )}
        </button>

        <span className="mr-2 whitespace-nowrap text-xs font-medium tabular-nums text-white/80">
          {formatTime(currentTime)}
          <span className="mx-1 text-white/40">/</span>
          {formatTime(duration)}
        </span>

        <div className="group/volume flex items-center" onMouseEnter={() => setIsVolumeControlVisible(true)}>
          <button
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isPlaybackDisabled}
            onClick={onToggleMute}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="size-5" aria-hidden="true" />
            ) : (
              <Volume2 className="size-5" aria-hidden="true" />
            )}
          </button>
          <div
            className={cn(
              'w-0 overflow-hidden opacity-0 transition-[width,opacity] duration-200 sm:block',
              isVolumeControlVisible && 'w-20 opacity-100',
            )}
          >
            <label className="sr-only" htmlFor="hls-player-volume">
              Volume
            </label>
            <input
              aria-label="Volume"
              className="h-1 w-16 cursor-pointer accent-white"
              disabled={isPlaybackDisabled}
              id="hls-player-volume"
              max="1"
              min="0"
              onChange={handleVolumeChange}
              step="0.05"
              type="range"
              value={isMuted ? 0 : volume}
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <div className="relative">
            <button
              aria-expanded={isSettingsOpen}
              aria-haspopup="menu"
              aria-label={`Player settings, current speed ${playbackRate}x`}
              className="grid size-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={isPlaybackDisabled}
              onClick={onToggleSettings}
              type="button"
            >
              <Settings2 className="size-5" aria-hidden="true" />
            </button>

            {isSettingsOpen ? (
              <div
                aria-label="Video settings"
                className="absolute bottom-12 right-0 w-40 overflow-hidden rounded-xl border border-border bg-surface p-1.5 text-copy shadow-2xl backdrop-blur-xl"
                role="menu"
              >
                <div className="px-2.5 pb-1.5 pt-2">
                  <p className="text-xs font-semibold text-copy">Speed</p>
                </div>
                <div className="h-px bg-border" />
                <div className="mt-1">
                  {SPEED_OPTIONS.map((option) => (
                    <button
                      aria-checked={playbackRate === option.value}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none',
                        playbackRate === option.value ? 'text-copy' : 'text-copy-muted',
                      )}
                      key={option.value}
                      onClick={() => onSpeedChange(option.value)}
                      role="menuitemradio"
                      type="button"
                    >
                      <span>{option.label}</span>
                      {playbackRate === option.value ? (
                        <Check className="size-4 text-brand" aria-hidden="true" />
                      ) : null}
                    </button>
                  ))}
                </div>
                <div className="my-1 h-px bg-border" />
                <div className="px-2.5 pb-1.5 pt-2">
                  <p className="text-xs font-semibold text-copy">Quality</p>
                </div>
                <div className="h-px bg-border" />
                <div className="mt-1">
                  {qualityOptions.map((option) => (
                    <button
                      aria-checked={qualityLevel === option.level}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-surface-muted focus-visible:outline-none',
                        qualityLevel === option.level ? 'text-copy' : 'text-copy-muted',
                      )}
                      key={option.level}
                      onClick={() => onQualityChange(option.level)}
                      role="menuitemradio"
                      type="button"
                    >
                      <span>{option.label}</span>
                      {qualityLevel === option.level ? (
                        <Check className="size-4 text-brand" aria-hidden="true" />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="grid size-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => void onFullscreen()}
            type="button"
          >
            {isFullscreen ? (
              <Minimize className="size-5" aria-hidden="true" />
            ) : (
              <Maximize className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
