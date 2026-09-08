import { getApiErrorResponse } from '../services/apiClient'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = getApiErrorResponse(error)
  if (apiError) return apiError.message

  return error instanceof Error ? error.message : fallback
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  return getApiErrorResponse(error)?.meta?.fieldErrors ?? {}
}
