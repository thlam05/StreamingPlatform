import { Heart, UserCheck, UserPlus } from 'lucide-react'

import { Button } from '../../../../components/ui/Button'

interface StreamEngagementActionsProps {
  isAuthenticated: boolean
  isMutating?: boolean
  isFollowing: boolean
  isLiked: boolean
  likeCount: number
  onFollow: () => void
  onLike: () => void
}

export function StreamEngagementActions({
  isAuthenticated,
  isMutating = false,
  isFollowing,
  isLiked,
  likeCount,
  onFollow,
  onLike,
}: StreamEngagementActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-label={isLiked ? 'Unlike this stream' : 'Like this stream'}
        aria-pressed={isLiked}
        className={isLiked ? 'border-danger/40 bg-danger/10 text-danger hover:bg-danger/15' : ''}
        disabled={isMutating}
        onClick={onLike}
        variant="secondary"
      >
        <Heart className={`size-4 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
        <span>{isAuthenticated ? likeCount.toLocaleString() : 'Sign in to like'}</span>
      </Button>
      <Button
        aria-pressed={isFollowing}
        disabled={isMutating}
        onClick={onFollow}
        variant={isFollowing ? 'secondary' : 'primary'}
      >
        {isFollowing ? (
          <UserCheck className="size-4" aria-hidden="true" />
        ) : (
          <UserPlus className="size-4" aria-hidden="true" />
        )}
        {isAuthenticated ? (isFollowing ? 'Following' : 'Follow') : 'Sign in to follow'}
      </Button>
    </div>
  )
}
