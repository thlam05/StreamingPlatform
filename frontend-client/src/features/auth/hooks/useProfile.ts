import { useEffect, useState } from 'react'

import { getAuthSession } from '../../../store/authStore'
import { getApiErrorMessage } from '../../../utils/error'
import { getProfile } from '../services/authService'
import type { AuthUser } from '../types/auth.types'

interface UseProfileResult {
  error: string | null
  isLoading: boolean
  profile: AuthUser | null
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<AuthUser | null>(() => getAuthSession()?.user ?? null)
  const [isLoading, setIsLoading] = useState(() => Boolean(getAuthSession()))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!getAuthSession()) {
      return () => {
        isMounted = false
      }
    }

    getProfile()
      .then((result) => {
        if (!isMounted) return
        setProfile(result)
      })
      .catch((requestError: unknown) => {
        if (!isMounted) return
        setError(getApiErrorMessage(requestError, 'Unable to load your profile.'))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { error, isLoading, profile }
}
