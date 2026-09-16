import { useState, type ChangeEvent } from 'react'

import { getApiErrorMessage, getApiFieldErrors } from '../../../utils/error'
import { useCreateStreamForm, validateCreateStream, type CreateStreamErrors } from './useCreateStreamForm'
import { useCreateStreamRequest } from './useCreateStreamRequest'

export function useCreateStream() {
  const form = useCreateStreamForm()
  const request = useCreateStreamRequest()
  const [formError, setFormError] = useState<string | null>(null)

  async function create(canSubmit: boolean) {
    const validationErrors = validateCreateStream(form.values)
    form.setErrors(validationErrors)
    form.markAllTouched()

    if (!canSubmit || Object.keys(validationErrors).length > 0) return null

    setFormError(null)

    try {
      return await request.submit(form.values)
    } catch (error) {
      form.setServerErrors(getApiFieldErrors(error) as CreateStreamErrors)
      setFormError(getApiErrorMessage(error, 'Unable to create this stream.'))
      return null
    }
  }

  function clearFormError() {
    setFormError(null)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    clearFormError()
    form.handleChange(event)
  }

  function handleParentChange(event: ChangeEvent<HTMLSelectElement>) {
    clearFormError()
    form.handleParentChange(event)
  }

  return {
    ...form,
    clearFormError,
    create,
    formError,
    handleChange,
    handleParentChange,
    isSubmitting: request.isSubmitting,
  }
}
