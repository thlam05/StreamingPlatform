import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'

import { cn } from '../../../../utils/cn'

export interface MediaPlayerControlsProps {
  currentTime: number
  duration: number
  disabled?: boolean
  isFullscreen: boolean
  isMuted: boolean
  isPlaying: boolean
  onSeek: (time: number) => void
  onFullscreen: () => void | Promise<void>
  onToggleMute: () => void
  onTogglePlayback: () => void | Promise<void>
  onVolumeChange: (volume: number) => void
  showTimeline: boolean
  volume: number
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00'

  const totalSeconds = Math.floor(value)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function MediaPlayerControls({
  currentTime,
  duration,
  disabled = false,
  isFullscreen,
  isMuted,
  isPlaying,
  onSeek,
  onFullscreen,
  onToggleMute,
  onTogglePlayback,
  onVolumeChange,
  showTimeline,
  volume,
}: MediaPlayerControlsProps) {
  const hasDuration = duration > 0

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-8 text-white">
      {showTimeline ? (
        <div className="mb-2 flex items-center gap-2">
          <input
            aria-label="Playback progress"
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled || !hasDuration}
            max={duration || 1}
            min="0"
            onChange={(event) => onSeek(Number(event.target.value))}
            step="any"
            type="range"
            value={Math.min(currentTime, duration || 1)}
          />
          <span className="shrink-0 text-xs tabular-nums text-white/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      ) : null}

      <div className="flex items-center gap-1">
        <button
          aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          onClick={() => void onTogglePlayback()}
          type="button"
        >
          {isPlaying ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
        </button>

        <button
          aria-label={isMuted ? 'Unmute playback' : 'Mute playback'}
          className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
          disabled={disabled}
          onClick={onToggleMute}
          type="button"
        >
          {isMuted ? (
            <VolumeX aria-hidden="true" className="size-5" />
          ) : (
            <Volume2 aria-hidden="true" className="size-5" />
          )}
        </button>

        <input
          aria-label="Volume"
          className="h-1.5 w-20 cursor-pointer accent-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-28"
          disabled={disabled}
          max="1"
          min="0"
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          step="0.05"
          type="range"
          value={isMuted ? 0 : volume}
        />

        <button
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className={cn(
            'ml-auto grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            disabled && 'cursor-not-allowed opacity-40',
          )}
          disabled={disabled}
          onClick={() => void onFullscreen()}
          type="button"
        >
          {isFullscreen ? (
            <Minimize aria-hidden="true" className="size-5" />
          ) : (
            <Maximize aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}
