import type { StreamProvisionResponse, StreamSetupPhase } from '../../types/stream.types'
import { CreateCredentialsStep } from './CreateCredentialsStep'
import { StreamPreviewStep } from './StreamPreviewStep'
import { UploadThumbnailStep } from './UploadThumbnailStep'

interface StreamSetupContentProps {
  onCredentialsCreated: (stream: StreamProvisionResponse) => void
  onReset: () => void
  onThumbnailSkipped: () => void
  onThumbnailUploaded: () => void
  phase: StreamSetupPhase
  stream: StreamProvisionResponse | null
}

export function StreamSetupContent({
  onCredentialsCreated,
  onReset,
  onThumbnailSkipped,
  onThumbnailUploaded,
  phase,
  stream,
}: StreamSetupContentProps) {
  if (phase.key === 'credentials') {
    return <CreateCredentialsStep onCreated={onCredentialsCreated} />
  }

  if (phase.key === 'thumbnail' && stream) {
    return (
      <UploadThumbnailStep
        onSkipped={onThumbnailSkipped}
        onUploaded={onThumbnailUploaded}
        streamId={stream.stream.id}
      />
    )
  }

  if (phase.key === 'preview' && stream) {
    return <StreamPreviewStep onReset={onReset} stream={stream} />
  }

  return null
}
