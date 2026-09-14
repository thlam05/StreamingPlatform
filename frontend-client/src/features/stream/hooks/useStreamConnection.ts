import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../../utils/error'
import { getStreamStatus } from '../services/streamService'
import type { StreamStatusResponse } from '../types/stream.types'

export function useStreamConnection(streamId: string | null, enabled: boolean) {
  const [streamStatus, setStreamStatus] = useState<StreamStatusResponse | null>(null)
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    if (!streamId || !enabled) return

    const currentStreamId = streamId
    let isCancelled = false
    let retryTimer: number | undefined

    async function checkStatus() {
      setIsCheckingConnection(true)

      try {
        const result = await getStreamStatus(currentStreamId)
        if (isCancelled) return

        setStreamStatus(result)
        setConnectionError(null)

        retryTimer = window.setTimeout(checkStatus, result.status === 'preview' ? 15000 : 2000)
      } catch (error) {
        if (isCancelled) return

        setConnectionError(getApiErrorMessage(error, 'Unable to check the broadcast connection.'))
        retryTimer = window.setTimeout(checkStatus, 2000)
      } finally {
        if (!isCancelled) setIsCheckingConnection(false)
      }
    }

    void checkStatus()

    return () => {
      isCancelled = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [enabled, streamId])

  return {
    connectionError,
    isConnected: streamStatus?.status === 'live',
    isCheckingConnection,
    playbackUrl: streamStatus?.playbackUrl ?? null,
    streamStatus,
  }
}
