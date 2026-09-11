import { Check } from 'lucide-react'

import type { StreamSetupPhase } from '../../hooks/useCreateStream'

interface PhaseRailProps {
  phase: StreamSetupPhase
}

export function PhaseRail({ phase }: PhaseRailProps) {
  const phaseItems = [
    { active: phase === 'editing', complete: phase !== 'editing', label: 'Create credentials' },
    { active: phase === 'thumbnail', complete: ['credentials', 'checking_connection', 'ready_to_start', 'waiting_for_signal', 'live'].includes(phase), label: 'Upload thumbnail' },
    { active: phase === 'credentials' || phase === 'checking_connection' || phase === 'ready_to_start', complete: phase === 'waiting_for_signal' || phase === 'live', label: 'Check connection' },
    { active: phase === 'waiting_for_signal' || phase === 'live', complete: phase === 'live', label: 'Start livestream' },
  ]

  return (
    <ol className="grid gap-2 sm:grid-cols-4" aria-label="Livestream setup progress">
      {phaseItems.map(({ active, complete, label }, index) => (
        <li className={`flex items-center gap-2 text-xs font-semibold ${active ? 'text-brand' : complete ? 'text-success' : 'text-copy-muted'}`} key={label}>
          <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${active ? 'border-brand bg-brand text-primary-foreground' : complete ? 'border-success/50 bg-success/10 text-success' : 'border-border bg-surface text-copy-muted'}`}>
            {complete ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
          </span>
          <span className="leading-4">{label}</span>
          {index < phaseItems.length - 1 ? <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  )
}
