import { Link } from 'react-router-dom'

import { paths } from '../routes/paths'

export function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-2xl border border-border bg-surface p-8 text-center">
      <p className="text-sm font-semibold text-brand">403</p>
      <h1 className="text-2xl font-semibold text-copy">You do not have access to this page.</h1>
      <Link className="inline-flex text-sm font-semibold text-brand hover:text-copy" to={paths.home}>
        Return home
      </Link>
    </div>
  )
}
