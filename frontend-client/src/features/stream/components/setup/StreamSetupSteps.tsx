import { Check } from 'lucide-react'

import { STREAM_SETUP_PHASES, type StreamSetupPhase } from '../../types/stream.types'

interface StreamSetupStepsProps {
  phase: StreamSetupPhase
}

export function StreamSetupSteps({ phase }: StreamSetupStepsProps) {
  const steps = Object.values(STREAM_SETUP_PHASES)
  const activeIndex = steps.findIndex((step) => step.key === phase.key)

  return (
    <ol aria-label="Livestream setup progress" className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => {
        const isActive = step.key === phase.key
        const isComplete = index < activeIndex

        return (
          <li className="flex items-center gap-3" key={step.key}>
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${isActive ? 'border-brand bg-brand text-primary-foreground' : isComplete ? 'border-success/50 bg-success/10 text-success' : 'border-border bg-surface text-copy-muted'}`}
            >
              {isComplete ? <Check aria-hidden="true" className="size-4" /> : index + 1}
            </span>
            <span className="min-w-0">
              <span
                className={`block text-xs font-semibold uppercase tracking-[0.12em] ${isActive ? 'text-brand' : isComplete ? 'text-success' : 'text-copy-muted'}`}
              >
                {step.label}
              </span>
              <span className="block truncate text-sm font-medium text-copy">{step.title}</span>
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="hidden h-px flex-1 bg-border sm:block" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
