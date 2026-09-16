import { Alert } from '../../components/ui/Alert'
import { AlertDialog } from '../../components/ui/AlertDialog'
import { Spinner } from '../../components/ui/Spinner'
import { StreamChatPanel } from '../../features/stream/components/detail/StreamChatPanel'
import { HlsPlayer } from '../../features/stream/components/player/HlsPlayer'
import { DashboardHeader } from '../../features/stream/components/studio/DashboardHeader'
import { DashboardPanels } from '../../features/stream/components/studio/DashboardPanels'
import { DashboardMetrics } from '../../features/stream/components/studio/DashboardMetrics'
import { useLivestreamDashboard } from '../../features/stream/hooks/useLivestreamDashboard'

export function LivestreamDashboardPage() {
  const dashboard = useLivestreamDashboard()

  if (!dashboard.streamId) return <p className="text-sm text-danger">Stream id is missing.</p>

  return (
    <div className="space-y-6">
      <DashboardHeader
        isEnding={dashboard.isEnding}
        isLive={dashboard.isLive}
        onEndStream={dashboard.requestEndStream}
      />

      {dashboard.isEndConfirmationOpen ? (
        <AlertDialog
          confirmLabel="End stream"
          description="Viewers will no longer be able to watch this broadcast after it ends. This action cannot be undone."
          isConfirming={dashboard.isEnding}
          onCancel={dashboard.cancelEndStream}
          onConfirm={dashboard.confirmEndStream}
          title="End this livestream?"
        />
      ) : null}

      {dashboard.connection.isCheckingConnection && !dashboard.status ? (
        <Spinner label="Loading livestream dashboard" />
      ) : null}

      {dashboard.connection.connectionError ? (
        <Alert
          action={
            <button className="font-semibold underline" onClick={dashboard.connection.retry} type="button">
              Retry
            </button>
          }
          variant="error"
        >
          {dashboard.connection.connectionError}
        </Alert>
      ) : null}

      {dashboard.endError ? <Alert variant="error">{dashboard.endError}</Alert> : null}

      {dashboard.status ? (
        <>
          <DashboardMetrics playbackUrl={dashboard.connection.playbackUrl} status={dashboard.status} />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="min-w-0 space-y-6">
              <HlsPlayer
                poster={dashboard.status.thumbnailUrl}
                src={dashboard.connection.playbackUrl}
                title={`${dashboard.status.title} livestream`}
              />
              <DashboardPanels status={dashboard.status} />
            </div>
            <StreamChatPanel isAvailable={dashboard.isLive} streamId={dashboard.streamId} />
          </section>
        </>
      ) : null}

      {!dashboard.status && !dashboard.connection.connectionError && !dashboard.connection.isCheckingConnection ? (
        <Alert variant="error">The livestream dashboard is unavailable.</Alert>
      ) : null}
    </div>
  )
}
