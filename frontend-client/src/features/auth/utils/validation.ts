import type { LoginFormValues, RegisterFormValues } from '../types/auth.types'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values: LoginFormValues): FieldErrors<LoginFormValues> {
  const errors: FieldErrors<LoginFormValues> = {}
  const email = values.email.trim()

  if (!email) errors.email = 'Email address is required.'
  else if (email.length > 255 || !emailPattern.test(email)) errors.email = 'Enter a valid email address.'

  if (!values.password) errors.password = 'Password is required.'

  return errors
}

export function validateRegister(values: RegisterFormValues): FieldErrors<RegisterFormValues> {
  const errors: FieldErrors<RegisterFormValues> = {}
  const username = values.username.trim()
  const email = values.email.trim()
  const displayName = values.displayName.trim()

  if (!username) errors.username = 'Username is required.'
  else if (username.length > 50) errors.username = 'Username must be 50 characters or fewer.'

  if (!email) errors.email = 'Email address is required.'
  else if (email.length > 255 || !emailPattern.test(email)) errors.email = 'Enter a valid email address.'

  if (!values.password) errors.password = 'Password is required.'
  else if (values.password.length < 8 || values.password.length > 100) errors.password = 'Password must be 8 to 100 characters.'

  if (!displayName) errors.displayName = 'Display name is required.'
  else if (displayName.length > 100) errors.displayName = 'Display name must be 100 characters or fewer.'

  if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'

  return errors
}
