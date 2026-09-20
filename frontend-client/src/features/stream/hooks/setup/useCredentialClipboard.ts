import { useEffect, useRef, useState } from 'react'

export type CredentialName = 'rtmpUrl' | 'streamKey'

interface UseCredentialClipboardResult {
  copiedCredential: CredentialName | null
  copyError: string | null
  handleCopy: (name: CredentialName, value: string) => Promise<void>
  resetClipboardState: () => void
  streamKeyVisible: boolean
  toggleStreamKeyVisibility: () => void
}

export function useCredentialClipboard(): UseCredentialClipboardResult {
  const [streamKeyVisible, setStreamKeyVisible] = useState(false)
  const [copiedCredential, setCopiedCredential] = useState<CredentialName | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const copyTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== undefined) window.clearTimeout(copyTimerRef.current)
    }
  }, [])

  async function handleCopy(name: CredentialName, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedCredential(name)
      setCopyError(null)

      if (copyTimerRef.current !== undefined) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopiedCredential(null), 2000)
    } catch {
      setCopyError('Copy failed. Select the value and copy it manually.')
    }
  }

  function resetClipboardState() {
    setStreamKeyVisible(false)
    setCopiedCredential(null)
    setCopyError(null)
    if (copyTimerRef.current !== undefined) window.clearTimeout(copyTimerRef.current)
  }

  return {
    copiedCredential,
    copyError,
    handleCopy,
    resetClipboardState,
    streamKeyVisible,
    toggleStreamKeyVisibility: () => setStreamKeyVisible((visible) => !visible),
  }
}
