import { ArrowLeft, StopCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { paths } from '../../../../routes/paths'

interface DashboardHeaderProps {
  isEnding: boolean
  isLive: boolean
  onEndStream: () => void
}

export function DashboardHeader({ isEnding, isLive, onEndStream }: DashboardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-copy-muted hover:text-copy"
        to={paths.studio}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Studio
      </Link>
      <Button
        className="border-danger/40 bg-danger text-white hover:bg-danger/90"
        disabled={!isLive || isEnding}
        isLoading={isEnding}
        onClick={onEndStream}
        variant="primary"
      >
        <StopCircle aria-hidden="true" className="size-4" />
        End stream
      </Button>
    </div>
  )
}
