import { useNavigate } from 'react-router-dom'

import { paths } from '../../../routes/paths'
import { saveAuthSession } from '../../../store/authStore'
import { login } from '../services/authService'
import type { LoginFormValues } from '../types/auth.types'
import { validateLogin } from '../utils/validation'
import { useAuthForm } from './useAuthForm'

const initialValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
}

export function useLoginForm() {
  const navigate = useNavigate()

  return useAuthForm<LoginFormValues>({
    initialValues,
    validate: validateLogin,
    onSubmit: async (values) => {
      const authResponse = await login({
        email: values.email.trim(),
        password: values.password,
      })

      saveAuthSession(authResponse, values.rememberMe)
      navigate(paths.home)
    },
  })
}
