import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

import { Button } from './Button'

interface AlertDialogProps {
  cancelLabel?: string
  confirmLabel?: string
  description: string
  isConfirming?: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export function AlertDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  isConfirming = false,
  onCancel,
  onConfirm,
  title,
}: AlertDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isConfirming) onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isConfirming, onCancel])

  return (
    <div
      aria-labelledby="alert-dialog-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid h-dvh w-dvw place-items-center bg-black/70 p-5 backdrop-blur-sm"
      role="alertdialog"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default"
        disabled={isConfirming}
        onClick={onCancel}
        type="button"
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
        <button
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl text-copy-muted transition-colors hover:bg-white/5 hover:text-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          disabled={isConfirming}
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>

        <div className="grid size-11 place-items-center rounded-2xl bg-warning/15 text-warning">
          <AlertTriangle aria-hidden="true" className="size-5" />
        </div>
        <h2 className="mt-5 pr-8 text-xl font-semibold text-copy" id="alert-dialog-title">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-copy-muted">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button disabled={isConfirming} onClick={onCancel} variant="ghost">
            {cancelLabel}
          </Button>
          <Button disabled={isConfirming} isLoading={isConfirming} onClick={onConfirm} variant="secondary">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
