import type { AuthResponse } from '../features/auth/types/auth.types'

const AUTH_SESSION_KEY = 'streamline.auth.session'

export interface AuthSession {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: AuthResponse['user']
}

export function saveAuthSession(authResponse: AuthResponse, rememberMe = true): void {
  const session: AuthSession = {
    accessToken: authResponse.accessToken,
    tokenType: authResponse.tokenType,
    expiresIn: authResponse.expiresIn,
    user: authResponse.user,
  }

  const targetStorage = rememberMe ? localStorage : sessionStorage
  const otherStorage = rememberMe ? sessionStorage : localStorage

  otherStorage.removeItem(AUTH_SESSION_KEY)
  targetStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

export function getAuthSession(): AuthSession | null {
  const storedSession = sessionStorage.getItem(AUTH_SESSION_KEY) ?? localStorage.getItem(AUTH_SESSION_KEY)
  if (!storedSession) return null

  try {
    return JSON.parse(storedSession) as AuthSession
  } catch {
    sessionStorage.removeItem(AUTH_SESSION_KEY)
    localStorage.removeItem(AUTH_SESSION_KEY)
    return null
  }
}

export function getAccessToken(): string | null {
  return getAuthSession()?.accessToken ?? null
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY)
  localStorage.removeItem(AUTH_SESSION_KEY)
}
