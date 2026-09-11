import { useEffect, useState } from 'react'

const maxThumbnailSize = 5 * 1024 * 1024
const acceptedThumbnailTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function useThumbnailSelection() {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl)
    }
  }, [thumbnailPreviewUrl])

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

    setThumbnailFile(file)
    setThumbnailPreviewUrl(URL.createObjectURL(file))
  }

  function resetThumbnail() {
    setThumbnailFile(null)
    setThumbnailPreviewUrl(null)
    setThumbnailError(null)
  }

  return {
    resetThumbnail,
    selectThumbnail,
    setThumbnailError,
    thumbnailError,
    thumbnailFile,
    thumbnailPreviewUrl,
  }
}
