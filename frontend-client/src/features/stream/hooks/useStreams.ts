import { useEffect, useState } from 'react'

import { getStreams } from '../services/streamService'
import type { Stream } from '../types/stream.types'

interface UseStreamsResult {
  error: string | null
  isLoading: boolean
  streams: Stream[]
}

export function useStreams(): UseStreamsResult {
  const [streams, setStreams] = useState<Stream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getStreams()
      .then((result) => {
        if (!isMounted) return
        setStreams(result)
      })
      .catch(() => {
        if (!isMounted) return
        setError('Unable to load streams right now.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { error, isLoading, streams }
}
