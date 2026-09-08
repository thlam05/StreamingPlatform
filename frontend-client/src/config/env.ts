const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api/v1'

if (apiBaseUrl && !/^https?:\/\//.test(apiBaseUrl)) {
  throw new Error('VITE_API_BASE_URL must be an absolute HTTP(S) URL.')
}

export const env = {
  apiBaseUrl,
} as const
