import axios from 'axios'

import { env } from '../config/env'
import type { ApiResponse } from '../types/api.types'
import { attachAuthToken } from './interceptors'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

apiClient.interceptors.request.use(attachAuthToken)

export function getApiErrorResponse(error: unknown): ApiResponse<null> | null {
  if (!axios.isAxiosError(error)) return null

  return (error.response?.data as ApiResponse<null> | undefined) ?? null
}
