import { useState, type ChangeEvent, type FocusEvent } from 'react'

import type { CreateStreamFormValues } from '../types/stream.types'

export type CreateStreamField = keyof CreateStreamFormValues
export type CreateStreamErrors = Partial<Record<CreateStreamField, string>>

export const initialCreateStreamValues: CreateStreamFormValues = {
  categoryId: '',
  description: '',
  title: '',
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function validateCreateStream(values: CreateStreamFormValues): CreateStreamErrors {
  const errors: CreateStreamErrors = {}
  const title = values.title.trim()
  const description = values.description.trim()
  const categoryId = values.categoryId.trim()

  if (!title) errors.title = 'Stream title is required.'
  else if (title.length > 200) errors.title = 'Stream title must be 200 characters or fewer.'

  if (description.length > 5000) errors.description = 'Description must be 5000 characters or fewer.'

  if (!categoryId) errors.categoryId = 'Category is required.'
  else if (!uuidPattern.test(categoryId)) errors.categoryId = 'Select a valid category.'

  return errors
}

export function useCreateStreamForm() {
  const [values, setValues] = useState<CreateStreamFormValues>(initialCreateStreamValues)
  const [errors, setErrors] = useState<CreateStreamErrors>({})
  const [touched, setTouched] = useState<Partial<Record<CreateStreamField, boolean>>>({})
  const [selectedParentId, setSelectedParentId] = useState('')

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.currentTarget.name as CreateStreamField
    const nextValues = { ...values, [field]: event.currentTarget.value }

    setValues(nextValues)

    if (touched[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validateCreateStream(nextValues)[field],
      }))
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.currentTarget.name as CreateStreamField
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: validateCreateStream(values)[field] }))
  }

  function handleParentChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedParentId(event.currentTarget.value)
    setValues((currentValues) => ({ ...currentValues, categoryId: '' }))
    setErrors((currentErrors) => ({ ...currentErrors, categoryId: undefined }))
  }

  function setServerErrors(serverErrors: CreateStreamErrors) {
    setErrors((currentErrors) => ({ ...currentErrors, ...serverErrors }))
  }

  function markAllTouched() {
    setTouched({ categoryId: true, description: true, title: true })
  }

  function resetForm() {
    setValues(initialCreateStreamValues)
    setErrors({})
    setTouched({})
    setSelectedParentId('')
  }

  return {
    errors,
    handleBlur,
    handleChange,
    handleParentChange,
    isValid: Object.keys(validateCreateStream(values)).length === 0,
    resetForm,
    markAllTouched,
    selectedParentId,
    setErrors,
    setServerErrors,
    values,
  }
}
