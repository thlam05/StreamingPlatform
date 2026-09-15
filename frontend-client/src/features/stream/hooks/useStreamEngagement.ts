import { useCallback, useState } from 'react'

interface UseStreamEngagementOptions {
  initialFollowing?: boolean
  initialLiked?: boolean
  initialLikeCount?: number
}

interface UseStreamEngagementResult {
  isFollowing: boolean
  isLiked: boolean
  likeCount: number
  toggleFollow: () => void
  toggleLike: () => void
}

export function useStreamEngagement({
  initialFollowing = false,
  initialLiked = false,
  initialLikeCount = 0,
}: UseStreamEngagementOptions = {}): UseStreamEngagementResult {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)

  const toggleFollow = useCallback(() => {
    setIsFollowing((following) => !following)
  }, [])

  const toggleLike = useCallback(() => {
    setIsLiked((liked) => {
      setLikeCount((count) => Math.max(0, count + (liked ? -1 : 1)))
      return !liked
    })
  }, [])

  return { isFollowing, isLiked, likeCount, toggleFollow, toggleLike }
}
