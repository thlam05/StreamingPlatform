import { Navigate, Outlet } from 'react-router-dom'

import { getAuthSession } from '../store/authStore'
import { paths } from './paths'

export function PublicOnlyRoute() {
  return getAuthSession() ? <Navigate replace to={paths.home} /> : <Outlet />
}
