import { useCallback, useMemo, useState } from 'react'

import { getAuthSession } from '../../../store/authStore'
import { getApiErrorMessage } from '../../../utils/error'
import { followStreamer, likeStream, unfollowStreamer, unlikeStream } from '../services/streamService'

interface UseStreamEngagementOptions {
  initialFollowing?: boolean
  initialLiked?: boolean
  initialLikeCount?: number
  streamId?: string
  streamerId?: string
}

interface UseStreamEngagementResult {
  engagementError: string | null
  isFollowing: boolean
  isLiked: boolean
  isMutating: boolean
  likeCount: number
  toggleFollow: () => Promise<void>
  toggleLike: () => Promise<void>
}

interface EngagementState {
  key: string
  following: boolean
  liked: boolean
  likeCount: number
  isMutating: boolean
}

export function useStreamEngagement({
  initialFollowing = false,
  initialLiked = false,
  initialLikeCount = 0,
  streamId,
  streamerId,
}: UseStreamEngagementOptions = {}): UseStreamEngagementResult {
  const stateKey = `${streamId ?? ''}:${initialFollowing}:${initialLiked}:${initialLikeCount}`
  const [state, setState] = useState<EngagementState>({
    key: stateKey,
    following: initialFollowing,
    liked: initialLiked,
    likeCount: initialLikeCount,
    isMutating: false,
  })
  const [engagementError, setEngagementError] = useState<string | null>(null)

  const currentState = useMemo(
    () =>
      state.key === stateKey
        ? state
        : {
            key: stateKey,
            following: initialFollowing,
            liked: initialLiked,
            likeCount: initialLikeCount,
            isMutating: false,
          },
    [initialFollowing, initialLikeCount, initialLiked, state, stateKey],
  )

  const toggleLike = useCallback(async () => {
    if (!streamId || !getAuthSession() || currentState.isMutating) return

    const nextLiked = !currentState.liked
    const previousCount = currentState.likeCount
    setEngagementError(null)
    setState({
      ...currentState,
      liked: nextLiked,
      likeCount: Math.max(0, previousCount + (nextLiked ? 1 : -1)),
      isMutating: true,
    })
    try {
      const result = nextLiked ? await likeStream(streamId) : await unlikeStream(streamId)
      setState({ ...currentState, liked: result.active, likeCount: result.count, isMutating: false })
    } catch (error) {
      setState({ ...currentState, liked: !nextLiked, likeCount: previousCount, isMutating: false })
      setEngagementError(getApiErrorMessage(error, 'Unable to update the like right now.'))
    }
  }, [currentState, streamId])

  const toggleFollow = useCallback(async () => {
    if (!streamerId || !getAuthSession() || currentState.isMutating) return

    const nextFollowing = !currentState.following
    setEngagementError(null)
    setState({ ...currentState, following: nextFollowing, isMutating: true })
    try {
      const result = nextFollowing ? await followStreamer(streamerId) : await unfollowStreamer(streamerId)
      setState({ ...currentState, following: result.active, isMutating: false })
    } catch (error) {
      setState({ ...currentState, following: !nextFollowing, isMutating: false })
      setEngagementError(getApiErrorMessage(error, 'Unable to update the follow right now.'))
    }
  }, [currentState, streamerId])

  return {
    engagementError,
    isFollowing: currentState.following,
    isLiked: currentState.liked,
    isMutating: currentState.isMutating,
    likeCount: currentState.likeCount,
    toggleFollow,
    toggleLike,
  }
}
