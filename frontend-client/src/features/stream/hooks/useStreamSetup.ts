import { useState } from 'react'

import {
  STREAM_SETUP_PHASES,
  type StreamProvisionResponse,
  type StreamSetupPhase,
  type StreamSetupStep,
} from '../types/stream.types'

export function useStreamSetup() {
  const [phaseKey, setPhaseKey] = useState<StreamSetupStep>('credentials')
  const [stream, setStream] = useState<StreamProvisionResponse | null>(null)

  const phase: StreamSetupPhase = STREAM_SETUP_PHASES[phaseKey]

  function handleCredentialsCreated(createdStream: StreamProvisionResponse) {
    setStream(createdStream)
    setPhaseKey('thumbnail')
  }

  function initializeExisting(existingStream: StreamProvisionResponse, phase: StreamSetupStep = 'preview') {
    setStream(existingStream)
    setPhaseKey(phase)
  }

  function handleThumbnailUploaded() {
    setPhaseKey('preview')
  }

  function handleThumbnailSkipped() {
    setPhaseKey('preview')
  }

  function resetSetup() {
    setPhaseKey('credentials')
    setStream(null)
  }

  return {
    handleCredentialsCreated,
    handleThumbnailSkipped,
    handleThumbnailUploaded,
    initializeExisting,
    phase,
    resetSetup,
    stream,
  }
}

export type StreamSetupController = ReturnType<typeof useStreamSetup>
