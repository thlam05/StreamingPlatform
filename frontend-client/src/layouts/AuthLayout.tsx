import { Radio } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { APP_NAME } from '../config/constants'
import { paths } from '../routes/paths'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-5 py-10 text-copy">
      <div className="w-full max-w-md">
        <Link className="mx-auto mb-8 flex w-fit items-center gap-2.5 text-lg font-bold" to={paths.home}>
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-ink-950">
            <Radio className="size-5" aria-hidden="true" />
          </span>
          {APP_NAME}
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
