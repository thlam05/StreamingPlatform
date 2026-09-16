import type { InternalAxiosRequestConfig } from 'axios'

import { clearAuthSession, getAccessToken } from '../store/authStore'

export function attachAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken()
  if (accessToken && !isExpiredJwt(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`
  } else if (accessToken) {
    clearAuthSession()
  }

  return config
}

function isExpiredJwt(token: string): boolean {
  const payload = token.split('.')[1]
  if (!payload) return false

  try {
    const decoded = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return typeof decoded.exp === 'number' && decoded.exp <= Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
