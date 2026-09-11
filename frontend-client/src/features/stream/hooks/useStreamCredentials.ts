import { useMemo } from 'react'

import type { StreamProvisionResponse } from '../types/stream.types'

export function useStreamCredentials(stream: StreamProvisionResponse | null) {
  return useMemo(() => {
    if (!stream) return null

    return {
      rtmpUrl: stream.rtmpUrl,
      streamKey: stream.streamKey,
    }
  }, [stream])
}
