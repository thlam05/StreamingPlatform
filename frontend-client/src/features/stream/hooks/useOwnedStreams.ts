import { useCallback, useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../../utils/error'
import { getOwnedStreams } from '../services/streamService'
import type { StreamStatusResponse } from '../types/stream.types'

export function useOwnedStreams() {
  const [streams, setStreams] = useState<StreamStatusResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setIsLoading(true)
    setReloadKey((current) => current + 1)
  }, [])

  useEffect(() => {
    let isMounted = true

    getOwnedStreams()
      .then((result) => {
        if (!isMounted) return
        setStreams(result)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (!isMounted) return
        setError(getApiErrorMessage(requestError, 'Unable to load your streams.'))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [reloadKey])

  return { error, isLoading, reload, streams }
}
