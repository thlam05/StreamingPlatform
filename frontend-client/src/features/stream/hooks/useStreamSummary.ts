import { useParams } from 'react-router-dom'

import { useStreamConnection } from './useStreamConnection'

export function useStreamSummary() {
  const { streamId } = useParams<{ streamId: string }>()
  const connection = useStreamConnection(streamId ?? null, Boolean(streamId))

  return {
    ...connection,
    isLoading: connection.isCheckingConnection && !connection.streamStatus,
    streamId,
    status: connection.streamStatus,
  }
}
