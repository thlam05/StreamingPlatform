import { useState } from 'react'

import { createStream } from '../services/streamService'
import type { CreateStreamFormValues, StreamProvisionResponse } from '../types/stream.types'

export function useCreateStreamRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(values: CreateStreamFormValues): Promise<StreamProvisionResponse> {
    setIsSubmitting(true)

    try {
      return await createStream({
        categoryId: values.categoryId.trim(),
        description: values.description.trim() || undefined,
        title: values.title.trim(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, submit }
}
