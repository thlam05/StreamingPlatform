import { apiClient } from '../../../services/apiClient'
import type { ApiResponse } from '../../../types/api.types'
import type { ChatMessage } from '../types/stream.types'

export async function getChatMessages(streamId: string): Promise<ChatMessage[]> {
  const response = await apiClient.get<ApiResponse<ChatMessage[]>>(`/streams/${streamId}/chat/messages`)
  return response.data.data
}

export async function sendChatMessage(
  streamId: string,
  message: string,
  clientMessageId: string,
): Promise<ChatMessage> {
  const response = await apiClient.post<ApiResponse<ChatMessage>>(`/streams/${streamId}/chat/messages`, {
    clientMessageId,
    message,
  })
  return response.data.data
}
