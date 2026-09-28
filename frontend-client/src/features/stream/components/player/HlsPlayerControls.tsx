import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'

import { cn } from '../../../../utils/cn'

export interface HlsPlayerControlsProps {
  disabled?: boolean
  isFullscreen: boolean
  isMuted: boolean
  isPlaying: boolean
  onFullscreen: () => void | Promise<void>
  onToggleMute: () => void
  onTogglePlayback: () => void | Promise<void>
  onVolumeChange: (nextVolume: number) => void
  volume: number
}

export function HlsPlayerControls({
  disabled = false,
  isFullscreen,
  isMuted,
  isPlaying,
  onFullscreen,
  onToggleMute,
  onTogglePlayback,
  onVolumeChange,
  volume,
}: HlsPlayerControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-1 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-8 text-white">
      <button
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled}
        onClick={() => void onTogglePlayback()}
        type="button"
      >
        {isPlaying ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
      </button>

      <button
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
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
  )
}
