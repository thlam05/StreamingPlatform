import { useNavigate } from 'react-router-dom'

import { paths } from '../../../routes/paths'
import { clearAuthSession } from '../../../store/authStore'

export function useLogout() {
  const navigate = useNavigate()

  return () => {
    clearAuthSession()
    navigate(paths.login, { replace: true })
  }
}
