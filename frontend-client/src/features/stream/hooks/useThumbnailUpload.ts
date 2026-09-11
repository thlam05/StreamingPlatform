import { useState } from 'react'

import { getApiErrorMessage } from '../../../utils/error'
import { uploadThumbnail } from '../services/streamService'

interface ThumbnailUploadInput {
  file: File
  streamId: string
}

export function useThumbnailUpload() {
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function submitThumbnail({ file, streamId }: ThumbnailUploadInput) {
    if (isUploadingThumbnail) return false

    setUploadError(null)
    setIsUploadingThumbnail(true)

    try {
      await uploadThumbnail(streamId, file)
      return true
    } catch (error) {
      setUploadError(getApiErrorMessage(error, 'Unable to upload the thumbnail. Try again.'))
      return false
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  return { isUploadingThumbnail, setUploadError, submitThumbnail, uploadError }
}
