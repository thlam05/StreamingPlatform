import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'

import { getApiErrorMessage, getApiFieldErrors } from '../../../utils/error'
import type { FieldErrors } from '../utils/validation'

interface UseAuthFormOptions<T extends object> {
  initialValues: T
  onSubmit: (values: T) => Promise<void>
  validate: (values: T) => FieldErrors<T>
}

export function useAuthForm<T extends object>({ initialValues, onSubmit, validate }: UseAuthFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.currentTarget.name as keyof T
    const nextValues = { ...values, [field]: event.currentTarget.value } as T

    setValues(nextValues)
    setFormError(null)

    if (touched[field]) {
      const nextValidationErrors = validate(nextValues)
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: nextValidationErrors[field],
      }))
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const field = event.currentTarget.name as keyof T
    const nextTouched = { ...touched, [field]: true }
    const nextValidationErrors = validate(values)

    setTouched(nextTouched)
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: nextValidationErrors[field],
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched(Object.keys(values).reduce<Partial<Record<keyof T, boolean>>>((result, field) => {
      result[field as keyof T] = true
      return result
    }, {}))

    if (Object.keys(validationErrors).length > 0) return

    setFormError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(values)
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      setErrors((currentErrors) => ({ ...currentErrors, ...fieldErrors }) as FieldErrors<T>)
      setFormError(getApiErrorMessage(error, 'Unable to complete this request.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    errors,
    formError,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
  }
}
