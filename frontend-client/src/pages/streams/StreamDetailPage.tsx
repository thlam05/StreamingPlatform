import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '../../components/ui/Spinner'
import { StreamChatPanel } from '../../features/stream/components/detail/StreamChatPanel'
import { StreamInfoPanel } from '../../features/stream/components/detail/StreamInfoPanel'
import { HlsPlayer } from '../../features/stream/components/player/HlsPlayer'
import { useStreamEngagement } from '../../features/stream/hooks/useStreamEngagement'
import { useStreamDetail } from '../../features/stream/hooks/useStreamDetail'
import { paths } from '../../routes/paths'
import { getAuthSession } from '../../store/authStore'

export function StreamDetailPage() {
  const { streamId } = useParams<{ streamId: string }>()
  const navigate = useNavigate()
  const { error, isLoading, stream } = useStreamDetail(streamId)
  const { engagementError, isFollowing, isLiked, isMutating, likeCount, toggleFollow, toggleLike } =
    useStreamEngagement({
      streamId,
      streamerId: stream?.streamerId,
      initialFollowing: stream?.following,
      initialLiked: stream?.liked,
      initialLikeCount: stream?.likeCount,
    })
  const isAuthenticated = Boolean(getAuthSession())

  function requireAuthentication(action: () => Promise<void>) {
    if (!isAuthenticated) {
      navigate(paths.login)
      return
    }
    void action()
  }

  if (isLoading) return <Spinner label="Loading stream" />
  if (error)
    return <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>
  if (!stream) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-8">
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="text-2xl font-semibold text-copy">Stream not found</h1>
        <Link className="inline-flex text-sm font-semibold text-brand hover:text-copy" to={paths.streams}>
          Back to streams
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-copy-muted hover:text-copy"
        to={paths.streams}
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to streams
      </Link>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="Stream content" className="min-w-0 space-y-5">
          {stream.status === 'live' && stream.playbackUrl ? (
            <HlsPlayer poster={stream.thumbnailUrl} src={stream.playbackUrl} title={`${stream.title} livestream`} />
          ) : (
            <section
              className={`relative aspect-video overflow-hidden rounded-3xl bg-gradient-to-br ${stream.gradientClass}`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
                  {stream.status === 'ended'
                    ? 'This livestream has ended'
                    : stream.status === 'cancelled'
                      ? 'This livestream was cancelled'
                      : 'Playback is not available'}
                </div>
              </div>
            </section>
          )}
          <StreamInfoPanel
            engagementError={engagementError}
            isAuthenticated={isAuthenticated}
            isFollowing={isFollowing}
            isLiked={isLiked}
            isMutating={isMutating}
            likeCount={likeCount}
            onFollow={() => requireAuthentication(toggleFollow)}
            onLike={() => requireAuthentication(toggleLike)}
            stream={stream}
          />
        </section>
        <StreamChatPanel isAvailable={stream.status === 'live'} streamId={streamId} />
      </div>
    </div>
  )
}
