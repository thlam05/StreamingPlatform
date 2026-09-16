import { useEffect, useState } from 'react'

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds].map((part) => part.toString().padStart(2, '0')).join(':')
}

export function useStreamDuration(startedAt?: string | null, endedAt?: string | null, isLive = false) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!isLive || !startedAt || endedAt) return

    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [endedAt, isLive, startedAt])

  if (!startedAt) return 'Not started'

  const startTime = Date.parse(startedAt)
  const endTime = endedAt ? Date.parse(endedAt) : isLive ? now : startTime
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) return '—'

  return formatDuration(Math.floor((endTime - startTime) / 1000))
}
