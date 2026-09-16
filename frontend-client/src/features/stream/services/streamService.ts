import { apiClient } from '../../../services/apiClient'
import type { ApiResponse } from '../../../types/api.types'
import type {
  CreateStreamRequest,
  EngagementResponse,
  Stream,
  StreamCategoryOption,
  StreamProvisionResponse,
  StreamStatusResponse,
  StreamStartResponse,
  UpdateStreamRequest,
} from '../types/stream.types'

export async function getStreams(): Promise<Stream[]> {
  const response = await apiClient.get<ApiResponse<StreamStatusResponse[]>>('/streams')
  return response.data.data.map(toStream)
}

export async function getOwnedStreams(): Promise<StreamStatusResponse[]> {
  const response = await apiClient.get<ApiResponse<StreamStatusResponse[]>>('/streams/mine')
  return response.data.data
}

export async function createStream(payload: CreateStreamRequest): Promise<StreamProvisionResponse> {
  const response = await apiClient.post<ApiResponse<StreamProvisionResponse>>('/streams', payload)
  return response.data.data
}

export async function getCategories(): Promise<StreamCategoryOption[]> {
  const response = await apiClient.get<ApiResponse<StreamCategoryOption[]>>('/categories')
  return response.data.data
}

export async function uploadThumbnail(streamId: string, file: File): Promise<StreamStatusResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<ApiResponse<StreamStatusResponse>>(`/streams/${streamId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data.data
}

export async function updateStream(streamId: string, payload: UpdateStreamRequest): Promise<void> {
  await apiClient.put(`/streams/${streamId}`, payload)
}

export async function getStreamStatus(streamId: string): Promise<StreamStatusResponse> {
  const response = await apiClient.get<ApiResponse<StreamStatusResponse>>(`/streams/${streamId}`)
  return response.data.data
}

export async function getStream(streamId: string): Promise<Stream> {
  const response = await apiClient.get<ApiResponse<StreamStatusResponse>>(`/streams/${streamId}`)
  return toStream(response.data.data)
}

export async function requestStreamStart(streamId: string): Promise<StreamStartResponse> {
  const response = await apiClient.post<ApiResponse<StreamStartResponse>>(`/streams/${streamId}/start`)
  return response.data.data
}

export async function cancelStream(streamId: string): Promise<void> {
  await apiClient.post(`/streams/${streamId}/cancel`)
}

export async function endStream(streamId: string): Promise<StreamStatusResponse> {
  const response = await apiClient.post<ApiResponse<StreamStatusResponse>>(`/streams/${streamId}/end`)
  return response.data.data
}

export async function likeStream(streamId: string): Promise<EngagementResponse> {
  const response = await apiClient.put<ApiResponse<EngagementResponse>>(`/streams/${streamId}/like`)
  return response.data.data
}

export async function unlikeStream(streamId: string): Promise<EngagementResponse> {
  const response = await apiClient.delete<ApiResponse<EngagementResponse>>(`/streams/${streamId}/like`)
  return response.data.data
}

export async function followStreamer(streamerId: string): Promise<EngagementResponse> {
  const response = await apiClient.put<ApiResponse<EngagementResponse>>(`/streamers/${streamerId}/follow`)
  return response.data.data
}

export async function unfollowStreamer(streamerId: string): Promise<EngagementResponse> {
  const response = await apiClient.delete<ApiResponse<EngagementResponse>>(`/streamers/${streamerId}/follow`)
  return response.data.data
}

function toStream(response: StreamStatusResponse): Stream {
  const displayName = response.streamer?.displayName || response.streamer?.username || 'Unknown creator'
  const startedAt = response.startedAt ? new Date(response.startedAt).getTime() : null
  const elapsedSeconds = startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0

  return {
    id: response.id,
    streamerId: response.streamer?.id ?? '',
    title: response.title,
    creator: displayName,
    initials: getInitials(displayName),
    category: response.categoryName ?? 'Live',
    viewers: response.viewerCount ?? 0,
    duration: formatDuration(elapsedSeconds),
    description: response.description ?? '',
    gradientClass: 'from-zinc-300 via-zinc-700 to-zinc-950',
    thumbnailUrl: response.thumbnailUrl,
    playbackUrl: response.playbackUrl,
    playbackUrl720p: response.playbackUrl720p,
    playbackUrl360p: response.playbackUrl360p,
    likeCount: response.likeCount,
    following: response.following,
    liked: response.liked,
    status: response.status,
    createdAt: response.createdAt,
  }
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':')
}
