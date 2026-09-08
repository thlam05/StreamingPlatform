export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  username: string
  email: string
  password: string
  displayName: string
  confirmPassword: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName: string
  avatarUrl?: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}
