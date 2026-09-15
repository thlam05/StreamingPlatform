import { Alert } from '../../components/ui/Alert'
import { Spinner } from '../../components/ui/Spinner'
import { StreamSummaryCard } from '../../features/stream/components/studio/StreamSummaryCard'
import { useStreamSummary } from '../../features/stream/hooks/useStreamSummary'

export function StreamSummaryPage() {
  const summary = useStreamSummary()

  if (!summary.streamId || summary.isLoading) return <Spinner label="Loading stream summary" />

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {summary.connectionError ? <Alert variant="error">{summary.connectionError}</Alert> : null}
      {summary.status ? <StreamSummaryCard status={summary.status} /> : null}
      {!summary.status && !summary.connectionError ? (
        <Alert variant="error">The stream summary is unavailable.</Alert>
      ) : null}
    </div>
  )
}
