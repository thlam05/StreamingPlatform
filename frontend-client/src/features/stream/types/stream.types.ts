export type StreamCategory = string
export type StreamStatus = 'scheduled' | 'preview' | 'live' | 'ended' | 'cancelled'
export type StreamSetupStep = 'credentials' | 'thumbnail' | 'preview'

export interface StreamSetupPhase {
  key: StreamSetupStep
  title: string
  description: string
  label: string
}

export const STREAM_SETUP_PHASES: Record<StreamSetupStep, StreamSetupPhase> = {
  credentials: {
    key: 'credentials',
    label: 'Step 1',
    title: 'Create credentials',
    description: 'Add the basic information for your livestream and create its publishing credentials.',
  },
  thumbnail: {
    key: 'thumbnail',
    label: 'Step 2',
    title: 'Upload thumbnail',
    description: 'Choose a clear image that viewers will see before the livestream starts.',
  },
  preview: {
    key: 'preview',
    label: 'Step 3',
    title: 'Preview and go live',
    description: 'Configure your encoder, preview the broadcast, and go live when the connection is ready.',
  },
}

export interface Stream {
  id: string
  streamerId: string
  title: string
  creator: string
  initials: string
  category: StreamCategory
  viewers: number
  duration: string
  description: string
  gradientClass: string
  thumbnailUrl?: string | null
  playbackUrl?: string | null
  playbackUrl720p?: string | null
  playbackUrl360p?: string | null
  likeCount?: number
  following?: boolean
  liked?: boolean
  status?: StreamStatus
  createdAt?: string
}

export interface StreamerSummary {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
}

export interface CreateStreamFormValues {
  title: string
  description: string
  categoryId: string
}

export interface CreateStreamRequest {
  title: string
  description?: string
  categoryId: string
}

export interface UpdateStreamRequest {
  title: string
  description?: string
  thumbnailUrl?: string
  categoryId: string
}

export interface StreamCategoryOption {
  id: string
  name: string
  level: number
  parentId: string | null
  status: string
  slug: string
  children: StreamCategoryOption[]
}

export interface StreamProvisionResponse {
  stream: StreamStatusResponse
  rtmpUrl: string | null
  streamKey: string | null
}

export interface StreamStatusResponse {
  id: string
  streamer?: StreamerSummary
  title: string
  description?: string | null
  categoryId?: string
  categoryName?: string
  status: StreamStatus
  thumbnailUrl?: string | null
  playbackUrl?: string | null
  playbackUrl720p?: string | null
  playbackUrl360p?: string | null
  createdAt?: string
  startedAt?: string | null
  endedAt?: string | null
  viewerCount?: number
  viewCount?: number
  likeCount?: number
  following?: boolean
  liked?: boolean
  startRequested?: boolean
  publisherObserved?: boolean
}

export interface StreamStartResponse {
  stream_id: string
  status: StreamStatus
  startRequested: boolean
  publisherObserved: boolean
}

export interface EngagementResponse {
  targetId: string
  action: 'follow' | 'unfollow' | 'like' | 'unlike'
  active: boolean
  count: number
}

export interface ChatMessage {
  id: string
  streamId: string
  sender: StreamerSummary
  message: string
  status: string
  createdAt: string
}
