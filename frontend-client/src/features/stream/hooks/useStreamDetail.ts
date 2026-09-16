import { useEffect, useState } from 'react'

import { getApiErrorResponse } from '../../../services/apiClient'
import { getApiErrorMessage } from '../../../utils/error'
import { getStream } from '../services/streamService'
import type { Stream } from '../types/stream.types'

export function useStreamDetail(streamId: string | undefined) {
  const [stream, setStream] = useState<Stream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resolvedStreamId, setResolvedStreamId] = useState<string | undefined>()

  useEffect(() => {
    if (!streamId) {
      return
    }

    const currentStreamId = streamId
    let isCancelled = false
    let refreshTimer: number | undefined

    async function loadStream() {
      try {
        const result = await getStream(currentStreamId)
        if (isCancelled) return

        setStream(result)
        setResolvedStreamId(currentStreamId)
        setError(null)
        if (result.status === 'live') {
          refreshTimer = window.setTimeout(loadStream, 10_000)
        }
      } catch (requestError) {
        if (isCancelled) return

        setResolvedStreamId(currentStreamId)
        setError(getApiErrorMessage(requestError, 'Unable to load this stream.'))
        if (getApiErrorResponse(requestError)?.meta?.status !== 404) {
          refreshTimer = window.setTimeout(loadStream, 5_000)
        }
      }
    }

    void loadStream()

    return () => {
      isCancelled = true
      if (refreshTimer !== undefined) window.clearTimeout(refreshTimer)
    }
  }, [streamId])

  const isResolved = resolvedStreamId === streamId
  return {
    error: !streamId ? 'Stream id is missing.' : isResolved ? error : null,
    isLoading: Boolean(streamId) && !isResolved,
    stream: isResolved && !error ? stream : null,
  }
}
