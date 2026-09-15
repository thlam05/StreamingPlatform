import { Coffee, Gift, Heart, Rocket, Send, Star } from 'lucide-react'
import { useState } from 'react'

import { Alert } from '../../../../components/ui/Alert'
import { Button } from '../../../../components/ui/Button'

const giftOptions = [
  { icon: Coffee, label: 'Coffee' },
  { icon: Heart, label: 'Heart' },
  { icon: Star, label: 'Star' },
  { icon: Rocket, label: 'Rocket' },
] as const

export function StreamGiftMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState<string | null>(null)

  return (
    <div className="relative">
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((open) => !open)}
        variant="secondary"
      >
        <Gift className="size-4" aria-hidden="true" />
        Gift
      </Button>

      {isOpen ? (
        <div
          aria-label="Send a gift"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/20"
          role="dialog"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-copy">Support the streamer</h2>
              <p className="mt-1 text-xs leading-5 text-copy-muted">Choose a gift to send during the livestream.</p>
            </div>
            <Gift className="size-5 shrink-0 text-brand" aria-hidden="true" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {giftOptions.map(({ icon: Icon, label }) => (
              <button
                aria-label={`Choose ${label} gift`}
                aria-pressed={selectedGift === label}
                className={`grid gap-1 rounded-xl border p-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  selectedGift === label
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border text-copy-muted hover:border-brand/50 hover:text-copy'
                }`}
                key={label}
                onClick={() => setSelectedGift(label)}
                type="button"
              >
                <Icon className="mx-auto size-5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {selectedGift ? (
            <Alert className="mt-3 p-3 text-xs" title={`${selectedGift} selected`} variant="info">
              Gift payments will be available soon.
            </Alert>
          ) : null}
          <Button className="mt-4 w-full" disabled={!selectedGift} variant="primary">
            <Send className="size-4" aria-hidden="true" />
            Send gift
          </Button>
        </div>
      ) : null}
    </div>
  )
}
