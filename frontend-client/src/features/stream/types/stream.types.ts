export type StreamCategory = 'Gaming' | 'Music' | 'Creative'
export type StreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface Stream {
  id: string
  title: string
  creator: string
  initials: string
  category: StreamCategory
  viewers: number
  duration: string
  description: string
  gradientClass: string
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

export interface ThumbnailUploadResponse {
  thumbnailUrl: string
}

export interface StreamProvisionResponse {
  stream: {
    id: string
    title: string
    status: StreamStatus
  }
  rtmpUrl: string
  streamKey: string
}

export interface StreamStatusResponse {
  id: string
  title: string
  status: StreamStatus
}
