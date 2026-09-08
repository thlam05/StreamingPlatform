import { useNavigate } from 'react-router-dom'

import { paths } from '../../../routes/paths'
import { saveAuthSession } from '../../../store/authStore'
import { register } from '../services/authService'
import type { RegisterFormValues } from '../types/auth.types'
import { validateRegister } from '../utils/validation'
import { useAuthForm } from './useAuthForm'

const initialValues: RegisterFormValues = {
  confirmPassword: '',
  displayName: '',
  email: '',
  password: '',
  username: '',
}

export function useRegisterForm() {
  const navigate = useNavigate()

  return useAuthForm<RegisterFormValues>({
    initialValues,
    validate: validateRegister,
    onSubmit: async (values) => {
      const authResponse = await register({
        displayName: values.displayName.trim(),
        email: values.email.trim(),
        password: values.password,
        username: values.username.trim(),
      })

      saveAuthSession(authResponse, true)
      navigate(paths.home)
    },
  })
}
