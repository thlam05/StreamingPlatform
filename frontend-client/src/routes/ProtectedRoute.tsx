import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { getAuthSession } from '../store/authStore'
import { paths } from './paths'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return getAuthSession() ? children : <Navigate replace to={paths.login} />
}
