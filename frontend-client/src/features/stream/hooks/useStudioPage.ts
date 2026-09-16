import { useNavigate } from 'react-router-dom'

import { useOwnedStreams } from './useOwnedStreams'
import { paths } from '../../../routes/paths'

export function useStudioPage() {
  const navigate = useNavigate()
  const streams = useOwnedStreams()

  return {
    ...streams,
    createStream: () => navigate(paths.studioStreamCreate),
  }
}
