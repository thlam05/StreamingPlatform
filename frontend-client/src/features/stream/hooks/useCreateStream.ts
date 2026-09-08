import { useEffect, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react'

import { getApiErrorMessage, getApiFieldErrors } from '../../../utils/error'
import { createStream, getCategories, getStreamStatus, updateStream, uploadThumbnail } from '../services/streamService'
import type { CreateStreamFormValues, StreamCategoryOption, StreamProvisionResponse } from '../types/stream.types'

type CreateStreamField = keyof CreateStreamFormValues
type CreateStreamErrors = Partial<Record<CreateStreamField, string>>
export type StreamSetupPhase = 'editing' | 'thumbnail' | 'credentials' | 'checking_connection' | 'ready_to_start' | 'waiting_for_signal' | 'live'

const initialValues: CreateStreamFormValues = {
  categoryId: '',
  description: '',
  title: '',
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const maxThumbnailSize = 5 * 1024 * 1024
const acceptedThumbnailTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validate(values: CreateStreamFormValues): CreateStreamErrors {
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

export function useCreateStream() {
  const [values, setValues] = useState<CreateStreamFormValues>(initialValues)
  const [errors, setErrors] = useState<CreateStreamErrors>({})
  const [touched, setTouched] = useState<Partial<Record<CreateStreamField, boolean>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdStream, setCreatedStream] = useState<StreamProvisionResponse | null>(null)
  const [phase, setPhase] = useState<StreamSetupPhase>('editing')
  const [categories, setCategories] = useState<StreamCategoryOption[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = useState<string | null>(null)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState('')
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)
  const [preflightError, setPreflightError] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [encoderReady, setEncoderReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    getCategories()
      .then((result) => {
        if (isMounted) setCategories(result)
      })
      .catch((error: unknown) => {
        if (isMounted) setCategoryError(getApiErrorMessage(error, 'Unable to load categories.'))
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl)
    }
  }, [thumbnailPreviewUrl])

  useEffect(() => {
    if (phase !== 'waiting_for_signal' || !createdStream) return

    let isCancelled = false
    let retryTimer: number | undefined
    const streamId = createdStream.stream.id

    async function pollStreamStatus() {
      try {
        const stream = await getStreamStatus(streamId)
        if (isCancelled) return

        if (stream.status === 'live') {
          setConnectionError(null)
          setPhase('live')
          return
        }

        if (stream.status === 'ended' || stream.status === 'cancelled') {
          setConnectionError(`This stream is ${stream.status} and cannot receive a broadcast.`)
          setPhase('credentials')
          return
        }

        retryTimer = window.setTimeout(pollStreamStatus, 4000)
      } catch (error) {
        if (isCancelled) return
        setConnectionError(getApiErrorMessage(error, 'Unable to check the broadcast status.'))
        retryTimer = window.setTimeout(pollStreamStatus, 4000)
      }
    }

    void pollStreamStatus()

    return () => {
      isCancelled = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [createdStream, phase])

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.currentTarget.name as CreateStreamField
    const nextValues = { ...values, [field]: event.currentTarget.value }

    setValues(nextValues)
    setFormError(null)

    if (touched[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validate(nextValues)[field],
      }))
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.currentTarget.name as CreateStreamField
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validate(values)[field],
    }))
  }

  function handleParentChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedParentId(event.currentTarget.value)
    setValues((currentValues) => ({ ...currentValues, categoryId: '' }))
    setErrors((currentErrors) => ({ ...currentErrors, categoryId: undefined }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched({ categoryId: true, description: true, title: true })

    if (Object.keys(validationErrors).length > 0 || categoryError || isLoadingCategories) return

    setFormError(null)
    setIsSubmitting(true)

    try {
      const result = await createStream({
        categoryId: values.categoryId.trim(),
        description: values.description.trim() || undefined,
        title: values.title.trim(),
      })
      setCreatedStream(result)
      setConnectionError(null)
      setPhase('thumbnail')
    } catch (error) {
      setErrors((currentErrors) => ({ ...currentErrors, ...getApiFieldErrors(error) }) as CreateStreamErrors)
      setFormError(getApiErrorMessage(error, 'Unable to create this stream.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  function selectThumbnail(file: File | undefined) {
    setThumbnailError(null)
    if (!file) return

    if (!acceptedThumbnailTypes.includes(file.type)) {
      setThumbnailError('Use a JPEG, PNG, WebP, or GIF image.')
      return
    }
    if (file.size > maxThumbnailSize) {
      setThumbnailError('Thumbnail must be 5 MB or smaller.')
      return
    }

    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl)
    setThumbnailFile(file)
    setThumbnailPreviewUrl(URL.createObjectURL(file))
  }

  async function submitThumbnail() {
    if (!createdStream || !thumbnailFile || isUploadingThumbnail) return

    setThumbnailError(null)
    setIsUploadingThumbnail(true)

    try {
      const { thumbnailUrl } = await uploadThumbnail(createdStream.stream.id, thumbnailFile)
      await updateStream(createdStream.stream.id, {
        categoryId: values.categoryId.trim(),
        description: values.description.trim() || undefined,
        thumbnailUrl,
        title: values.title.trim(),
      })
      setPhase('credentials')
    } catch (error) {
      setThumbnailError(getApiErrorMessage(error, 'Unable to upload the thumbnail. Try again.'))
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  function skipThumbnail() {
    setThumbnailError(null)
    setPhase('credentials')
  }

  async function checkConnection() {
    if (!createdStream || isCheckingConnection || phase === 'checking_connection') return

    setIsCheckingConnection(true)
    setPreflightError(null)
    setPhase('checking_connection')

    try {
      const stream = await getStreamStatus(createdStream.stream.id)
      if (stream.status !== 'scheduled') {
        setPreflightError(`This stream is ${stream.status}. Create a new stream to publish again.`)
        setPhase('credentials')
        return
      }
      setPhase('ready_to_start')
    } catch (error) {
      setPreflightError(getApiErrorMessage(error, 'Unable to run the connection check.'))
      setPhase('credentials')
    } finally {
      setIsCheckingConnection(false)
    }
  }

  function startWaitingForSignal() {
    if (!createdStream || phase !== 'ready_to_start' || !encoderReady) return
    setConnectionError(null)
    setPhase('waiting_for_signal')
  }

  function resetForm() {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setFormError(null)
    setCreatedStream(null)
    setPhase('editing')
    setThumbnailFile(null)
    setThumbnailPreviewUrl(null)
    setThumbnailError(null)
    setSelectedParentId('')
    setPreflightError(null)
    setConnectionError(null)
    setEncoderReady(false)
  }

  const isValid = Object.keys(validate(values)).length === 0 && !categoryError && !isLoadingCategories
  const parentCategories = categories
  const childCategories = categories.find((category) => category.id === selectedParentId)?.children ?? []

  return {
    categories,
    categoryError,
    childCategories,
    checkConnection,
    connectionError,
    createdStream,
    encoderReady,
    errors,
    formError,
    handleBlur,
    handleChange,
    handleParentChange,
    handleSubmit,
    isCheckingConnection,
    isLoadingCategories,
    isSubmitting,
    isUploadingThumbnail,
    isValid,
    parentCategories,
    phase,
    preflightError,
    resetForm,
    selectThumbnail,
    selectedParentId,
    setEncoderReady,
    skipThumbnail,
    startWaitingForSignal,
    submitThumbnail,
    thumbnailError,
    thumbnailFile,
    thumbnailPreviewUrl,
    values,
  }
}
