import { apiClient } from '../../../services/apiClient'
import type { ApiResponse } from '../../../types/api.types'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.types'

function unwrapAuthResponse(response: { data: ApiResponse<AuthResponse> }): AuthResponse {
  return response.data.data
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload)
  return unwrapAuthResponse(response)
}

export async function getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<AuthUser>>('/users/me')
  return response.data.data
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload)
  return unwrapAuthResponse(response)
}
