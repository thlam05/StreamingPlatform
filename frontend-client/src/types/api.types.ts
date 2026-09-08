export interface ApiResponse<T> {
  data: T
  code: string
  message: string
  meta?: ApiErrorMeta
}

export interface ApiErrorMeta {
  timestamp?: string
  status?: number
  path?: string
  fieldErrors?: Record<string, string>
}
