import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '../../../utils/error'
import { getCategories } from '../services/streamService'
import type { StreamCategoryOption } from '../types/stream.types'

export function useStreamCategories(selectedParentId: string) {
  const [categories, setCategories] = useState<StreamCategoryOption[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

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

  return {
    categories,
    categoryError,
    childCategories: categories.find((category) => category.id === selectedParentId)?.children ?? [],
    isLoadingCategories,
    parentCategories: categories,
  }
}
