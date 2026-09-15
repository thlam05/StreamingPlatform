import { RefreshCw } from 'lucide-react'

import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { StudioEmptyState } from '../../features/stream/components/studio/StudioEmptyState'
import { StudioHeader } from '../../features/stream/components/studio/StudioHeader'
import { StudioStreamList } from '../../features/stream/components/studio/StudioStreamList'
import { useStudioPage } from '../../features/stream/hooks/useStudioPage'

export function StudioPage() {
  const { createStream, error, isLoading, reload, streams } = useStudioPage()

  return (
    <div className="space-y-8">
      <StudioHeader onCreateStream={createStream} />

      {isLoading ? <Spinner label="Loading your streams" /> : null}

      {error ? (
        <Alert
          action={
            <Button onClick={reload} variant="secondary">
              <RefreshCw aria-hidden="true" className="size-4" />
              Retry
            </Button>
          }
          variant="error"
        >
          {error}
        </Alert>
      ) : null}

      {!isLoading && !error && streams.length === 0 ? <StudioEmptyState onCreateStream={createStream} /> : null}

      {!isLoading && !error && streams.length > 0 ? <StudioStreamList streams={streams} /> : null}
    </div>
  )
}
