import { useMemo } from 'react'

import type { StreamProvisionResponse } from '../types/stream.types'

export function useStreamCredentials(stream: StreamProvisionResponse | null) {
  return useMemo(() => {
    if (!stream?.rtmpUrl || !stream.streamKey) return null

    return {
      rtmpUrl: stream.rtmpUrl,
      streamKey: stream.streamKey,
    }
  }, [stream])
}
