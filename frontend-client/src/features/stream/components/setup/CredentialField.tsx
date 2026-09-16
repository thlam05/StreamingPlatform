import { Check, Copy, Eye, EyeOff, KeyRound, Server } from 'lucide-react'

import type { CredentialName } from '../../hooks/useCredentialClipboard'

interface CredentialFieldProps {
  copied: boolean
  name: CredentialName
  onCopy: (name: CredentialName, value: string) => Promise<void>
  onToggleVisibility?: () => void
  value: string
  visible?: boolean
}

export function CredentialField({
  copied,
  name,
  onCopy,
  onToggleVisibility,
  value,
  visible = true,
}: CredentialFieldProps) {
  const label = name === 'rtmpUrl' ? 'Stream URL' : 'Stream key'
  const displayedValue = visible ? value : '••••••••••••••••••••••••'
  const inputId = `stream-credential-${name}`

  return (
    <div className="grid min-w-0 gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-copy" htmlFor={inputId}>
          {name === 'rtmpUrl' ? (
            <Server className="size-3.5 text-brand" aria-hidden="true" />
          ) : (
            <KeyRound className="size-3.5 text-warning" aria-hidden="true" />
          )}
          {label}
        </label>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-copy-muted">Read only</span>
      </div>
      <div className="relative">
        <input
          aria-label={`${label}, read only`}
          className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-3 pr-24 font-mono text-sm text-copy outline-none transition-colors read-only:cursor-default focus:border-brand focus:ring-2 focus:ring-brand/20"
          id={inputId}
          readOnly
          value={displayedValue}
        />
        <div className="absolute inset-y-1 right-1 flex items-center gap-1">
          {onToggleVisibility ? (
            <button
              aria-pressed={visible}
              aria-label={visible ? 'Hide stream key' : 'Show stream key'}
              className="grid size-9 place-items-center rounded-lg text-copy-muted transition-colors hover:bg-surface hover:text-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.96]"
              onClick={onToggleVisibility}
              type="button"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          ) : null}
          <button
            aria-label={`Copy ${label.toLowerCase()}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-copy-muted transition-colors hover:bg-surface hover:text-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.96]"
            onClick={() => void onCopy(name, value)}
            type="button"
          >
            {copied ? (
              <Check className="size-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
