import { Heart, UserCheck, UserPlus } from 'lucide-react'

import { Button } from '../../../../components/ui/Button'

interface StreamEngagementActionsProps {
  isFollowing: boolean
  isLiked: boolean
  likeCount: number
  onFollow: () => void
  onLike: () => void
}

export function StreamEngagementActions({
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
        onClick={onLike}
        variant="secondary"
      >
        <Heart className={`size-4 ${isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
        <span>{likeCount.toLocaleString()}</span>
      </Button>
      <Button aria-pressed={isFollowing} onClick={onFollow} variant={isFollowing ? 'secondary' : 'primary'}>
        {isFollowing ? (
          <UserCheck className="size-4" aria-hidden="true" />
        ) : (
          <UserPlus className="size-4" aria-hidden="true" />
        )}
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  )
}
