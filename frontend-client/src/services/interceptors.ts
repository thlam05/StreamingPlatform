import type { InternalAxiosRequestConfig } from 'axios'

import { getAccessToken } from '../store/authStore'

export function attachAuthToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = getAccessToken()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`

  return config
}
