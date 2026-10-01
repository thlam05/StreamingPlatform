import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from 'lucide-react'

import { SPEED_OPTIONS } from '../../constants/player.constants'
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
  onPlaybackRateChange: (rate: number) => void
  onToggleMute: () => void
  onTogglePlayback: () => void | Promise<void>
  onVolumeChange: (volume: number) => void
  playbackRate: number
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
  onPlaybackRateChange,
  onToggleMute,
  onTogglePlayback,
  onVolumeChange,
  playbackRate,
  showTimeline,
  volume,
}: MediaPlayerControlsProps) {
  const hasDuration = duration > 0
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsSection, setSettingsSection] = useState<'root' | 'playbackRate'>('root')
  const currentSpeedLabel = SPEED_OPTIONS.find((option) => option.value === playbackRate)?.label ?? `${playbackRate}x`

  function toggleSettings() {
    setIsSettingsOpen((isOpen) => !isOpen)
    setSettingsSection('root')
  }

  function selectPlaybackRate(rate: number) {
    onPlaybackRateChange(rate)
    setIsSettingsOpen(false)
    setSettingsSection('root')
  }

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

        <div className="relative ml-auto">
          <button
            aria-expanded={isSettingsOpen}
            aria-haspopup="menu"
            aria-label="Player settings"
            className="grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled}
            onClick={toggleSettings}
            type="button"
          >
            <Settings aria-hidden="true" className="size-5" />
          </button>

          {isSettingsOpen ? (
            <div
              aria-label="Player settings menu"
              className="absolute bottom-12 right-0 z-20 min-w-56 overflow-hidden rounded-xl border border-white/25 bg-black/95 p-1 text-sm text-white shadow-2xl backdrop-blur"
              role="menu"
            >
              {settingsSection === 'root' ? (
                <>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                    onClick={() => setSettingsSection('playbackRate')}
                    role="menuitem"
                    type="button"
                  >
                    <span className="flex-1">Playback speed</span>
                    <span className="text-white/60">{currentSpeedLabel}</span>
                    <ChevronRight aria-hidden="true" className="size-4 text-white/60" />
                  </button>

                  <button
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-left text-white/50"
                    disabled
                    role="menuitem"
                    type="button"
                  >
                    <span className="flex-1">Resolution</span>
                    <span className="text-white/40">Auto</span>
                    <ChevronRight aria-hidden="true" className="size-4 text-white/30" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                    onClick={() => setSettingsSection('root')}
                    role="menuitem"
                    type="button"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                    <span>Playback speed</span>
                  </button>

                  {SPEED_OPTIONS.map((option) => (
                    <button
                      aria-checked={option.value === playbackRate}
                      className={cn(
                        'flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white',
                        option.value === playbackRate ? 'bg-white/15 text-white' : 'text-white/80',
                      )}
                      key={option.value}
                      onClick={() => selectPlaybackRate(option.value)}
                      role="menuitemradio"
                      type="button"
                    >
                      <span className="flex-1">{option.label}</span>
                      {option.value === playbackRate ? <span aria-hidden="true">✓</span> : null}
                    </button>
                  ))}
                </>
              )}
            </div>
          ) : null}
        </div>

        <button
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
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
