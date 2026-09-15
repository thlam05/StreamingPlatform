import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useStreamConnection } from './useStreamConnection'
import { cancelStream } from '../services/streamService'
import { paths } from '../../../routes/paths'
import { getApiErrorMessage } from '../../../utils/error'

function getStatusLabel(status: string | undefined, startRequested: boolean) {
  if (status === 'live') return 'Live'
  if (status === 'ended') return 'Ended'
  if (status === 'cancelled') return 'Cancelled'
  if (startRequested) return 'Starting'
  if (status === 'preview') return 'Preview'
  return 'Connecting'
}

export function useLivestreamDashboard() {
  const { streamId } = useParams<{ streamId: string }>()
  const navigate = useNavigate()
  const connection = useStreamConnection(streamId ?? null, Boolean(streamId))
  const [isEnding, setIsEnding] = useState(false)
  const [isEndConfirmationOpen, setIsEndConfirmationOpen] = useState(false)
  const [endError, setEndError] = useState<string | null>(null)
  const status = connection.streamStatus

  useEffect(() => {
    if (streamId && (status?.status === 'ended' || status?.status === 'cancelled')) {
      navigate(paths.studioStreamSummary(streamId), { replace: true })
    }
  }, [navigate, status?.status, streamId])

  function requestEndStream() {
    if (status?.status !== 'live') return
    setEndError(null)
    setIsEndConfirmationOpen(true)
  }

  function cancelEndStream() {
    if (isEnding) return
    setIsEndConfirmationOpen(false)
  }

  async function confirmEndStream() {
    if (!streamId || status?.status !== 'live') return

    setIsEnding(true)
    setIsEndConfirmationOpen(false)
    setEndError(null)
    try {
      await cancelStream(streamId)
      navigate(paths.studioStreamSummary(streamId), { replace: true })
    } catch (error) {
      setEndError(getApiErrorMessage(error, 'Unable to end the livestream.'))
    } finally {
      setIsEnding(false)
    }
  }

  return {
    connection,
    endError,
    cancelEndStream,
    confirmEndStream,
    isEnding,
    isEndConfirmationOpen,
    isLive: status?.status === 'live',
    requestEndStream,
    isTerminal: status?.status === 'ended' || status?.status === 'cancelled',
    status,
    statusLabel: getStatusLabel(status?.status, Boolean(status?.startRequested)),
    streamId,
  }
}
