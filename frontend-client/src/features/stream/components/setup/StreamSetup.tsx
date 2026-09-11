import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../../../routes/paths'
import { useStreamSetup } from '../../hooks/useStreamSetup'
import { StreamSetupContent } from './StreamSetupContent'
import { StreamSetupSteps } from './StreamSetupSteps'

export function StreamSetup() {
  const setup = useStreamSetup()

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand">Creator studio</p>
        </div>
        <Link
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-copy-muted hover:text-copy sm:self-auto"
          to={paths.streams}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to streams
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/5 sm:p-6">
        <div className="mb-5 border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">{setup.phase.label}</p>
          <h2 className="mt-1 text-lg font-semibold text-copy">{setup.phase.title}</h2>
          <p className="mt-1 text-sm text-copy-muted">{setup.phase.description}</p>
        </div>
        <StreamSetupSteps phase={setup.phase} />
      </div>

      <StreamSetupContent
        onCredentialsCreated={setup.handleCredentialsCreated}
        onReset={setup.resetSetup}
        onThumbnailSkipped={setup.handleThumbnailSkipped}
        onThumbnailUploaded={setup.handleThumbnailUploaded}
        phase={setup.phase}
        stream={setup.stream}
      />
    </div>
  )
}
