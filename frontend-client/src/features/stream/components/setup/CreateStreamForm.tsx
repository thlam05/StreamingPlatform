import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { paths } from '../../../../routes/paths'
import { useCreateStream } from '../../hooks/useCreateStream'
import { useCredentialClipboard } from '../../hooks/useCredentialClipboard'
import { CreateStreamDetailsStep } from './CreateStreamDetailsStep'
import { CredentialsStep } from './CredentialsStep'
import { PhaseRail } from './PhaseRail'
import { ThumbnailStep } from './ThumbnailStep'

const CREDENTIAL_PHASES = ['credentials', 'checking_connection', 'ready_to_start', 'waiting_for_signal', 'live'] as const

export function CreateStreamForm() {
  const streamForm = useCreateStream()
  const credentialClipboard = useCredentialClipboard()
  const { createdStream, phase, resetForm } = streamForm

  function handleReset() {
    resetForm()
    credentialClipboard.resetClipboardState()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand">Creator studio</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">Create a livestream</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-copy-muted">Create the room, add a thumbnail, check your connection, then start broadcasting.</p>
        </div>
        <Link className="inline-flex items-center gap-2 self-start text-sm font-semibold text-copy-muted hover:text-copy sm:self-auto" to={paths.streams}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to streams
        </Link>
      </div>

      <PhaseRail phase={phase} />

      {phase === 'editing' ? <CreateStreamDetailsStep {...streamForm} /> : null}

      {phase === 'thumbnail' && createdStream ? <ThumbnailStep {...streamForm} /> : null}

      {createdStream && CREDENTIAL_PHASES.includes(phase as (typeof CREDENTIAL_PHASES)[number]) ? (
        <CredentialsStep
          {...streamForm}
          {...credentialClipboard}
          createdStream={createdStream}
          onReset={handleReset}
        />
      ) : null}
    </div>
  )
}
