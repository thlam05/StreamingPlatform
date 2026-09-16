import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../../utils/error'
import { getApiErrorResponse } from '../../../services/apiClient'
import { getStreamStatus } from '../services/streamService'
import type { StreamStatusResponse } from '../types/stream.types'

export function useStreamConnection(streamId: string | null, enabled: boolean) {
  const [streamStatus, setStreamStatus] = useState<StreamStatusResponse | null>(null)
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [connectionStreamId, setConnectionStreamId] = useState<string | null>(null)
  const [errorStreamId, setErrorStreamId] = useState<string | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [lastUpdatedStreamId, setLastUpdatedStreamId] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (!streamId || !enabled) {
      return
    }

    const currentStreamId = streamId
    let isCancelled = false
    let retryTimer: number | undefined
    let failureCount = 0

    function scheduleRetry() {
      const delay = Math.min(30_000, 1_000 * 2 ** Math.min(failureCount, 5))
      retryTimer = window.setTimeout(checkStatus, delay)
    }

    async function checkStatus() {
      setIsCheckingConnection(true)

      try {
        const result = await getStreamStatus(currentStreamId)
        if (isCancelled) return

        setStreamStatus(result)
        setConnectionStreamId(currentStreamId)
        setLastUpdatedAt(new Date())
        setLastUpdatedStreamId(currentStreamId)
        setConnectionError(null)
        setErrorStreamId(null)
        failureCount = 0

        if (result.status !== 'ended' && result.status !== 'cancelled') {
          retryTimer = window.setTimeout(checkStatus, result.status === 'live' ? 5000 : 2000)
        }
      } catch (error) {
        if (isCancelled) return

        setConnectionError(getApiErrorMessage(error, 'Unable to check the broadcast connection.'))
        setErrorStreamId(currentStreamId)
        failureCount += 1
        if (getApiErrorResponse(error)?.meta?.status !== 404) {
          scheduleRetry()
        }
      } finally {
        if (!isCancelled) setIsCheckingConnection(false)
      }
    }

    void checkStatus()

    return () => {
      isCancelled = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [enabled, retryKey, streamId])

  return {
    connectionError: errorStreamId === streamId ? connectionError : null,
    isConnected: connectionStreamId === streamId && streamStatus?.status === 'live',
    isCheckingConnection: Boolean(streamId && enabled) && isCheckingConnection,
    lastUpdatedAt: lastUpdatedStreamId === streamId ? lastUpdatedAt : null,
    playbackUrl: connectionStreamId === streamId ? (streamStatus?.playbackUrl ?? null) : null,
    retry: () => setRetryKey((current) => current + 1),
    streamStatus: connectionStreamId === streamId ? streamStatus : null,
  }
}
