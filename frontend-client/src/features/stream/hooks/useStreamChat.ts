import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { env } from '../../../config/env'
import { getAccessToken, getAuthSession } from '../../../store/authStore'
import { getApiErrorMessage } from '../../../utils/error'
import { getChatMessages, sendChatMessage as sendChatMessageRequest } from '../services/chatService'
import type { ChatMessage } from '../types/stream.types'

type ChatConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected'

export function useStreamChat(streamId: string | undefined) {
  const isAuthenticated = Boolean(getAuthSession())
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ChatConnectionStatus>('idle')
  const [connectionStatusStreamId, setConnectionStatusStreamId] = useState<string | undefined>()
  const [connectedStreamId, setConnectedStreamId] = useState<string | undefined>()
  const [loadedStreamId, setLoadedStreamId] = useState<string | undefined>()
  const socketRef = useRef<WebSocket | null>(null)
  const socketUrl = useMemo(() => {
    if (!streamId) return null
    return `${env.wsBaseUrl}/ws/streams/${streamId}/chat`
  }, [streamId])

  useEffect(() => {
    if (!streamId || !isAuthenticated) return

    let isCancelled = false
    let socket: WebSocket | null = null
    let reconnectTimer: number | undefined

    getChatMessages(streamId)
      .then((loadedMessages) => {
        if (!isCancelled) {
          setMessages(loadedMessages)
          setLoadedStreamId(streamId)
          setError(null)
        }
      })
      .catch((requestError) => {
        if (!isCancelled) {
          setLoadedStreamId(streamId)
          setError(getApiErrorMessage(requestError, 'Unable to load chat messages.'))
        }
      })

    function connect() {
      if (!socketUrl || isCancelled) return
      socket = new WebSocket(socketUrl)
      socketRef.current = socket
      socket.onopen = () => {
        socket?.send(JSON.stringify({ type: 'auth', accessToken: getAccessToken() }))
      }
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { type?: string; message?: ChatMessage | string }
          if (payload.type === 'ready') {
            setConnectionStatus('connected')
            setConnectionStatusStreamId(streamId)
            setConnectedStreamId(streamId)
            return
          }
          if (payload.type === 'message' && payload.message && typeof payload.message !== 'string') {
            const chatMessage = payload.message
            setMessages((current) =>
              current.some((item) => item.id === chatMessage.id) ? current : [...current, chatMessage],
            )
          }
          if (payload.type === 'message_rejected') {
            setError(typeof payload.message === 'string' ? payload.message : 'Chat message was rejected.')
          }
        } catch {
          setError('Received an invalid chat message.')
        }
      }
      socket.onclose = (event) => {
        setConnectionStatus('disconnected')
        setConnectionStatusStreamId(streamId)
        if (!isCancelled && event.code !== 1008) {
          reconnectTimer = window.setTimeout(connect, 2000)
        }
      }
      socket.onerror = () => {
        setConnectionStatus('disconnected')
        setConnectionStatusStreamId(streamId)
      }
    }

    connect()

    return () => {
      isCancelled = true
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer)
      socket?.close()
      socketRef.current = null
    }
  }, [isAuthenticated, socketUrl, streamId])

  const sendMessage = useCallback(
    async (message: string): Promise<boolean> => {
      if (!streamId || !isAuthenticated) return false
      const trimmed = message.trim()
      if (!trimmed) return false

      setError(null)
      const clientMessageId = crypto.randomUUID()
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'message', message: trimmed, clientMessageId }))
        return true
      }

      try {
        const response = await sendChatMessageRequest(streamId, trimmed, clientMessageId)
        setMessages((current) => (current.some((item) => item.id === response.id) ? current : [...current, response]))
        return true
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Unable to send the chat message.'))
        return false
      }
    },
    [isAuthenticated, streamId],
  )

  const visibleMessages = isAuthenticated && loadedStreamId === streamId ? messages : []
  return {
    error: isAuthenticated && loadedStreamId === streamId ? error : null,
    isAuthenticated,
    connectionStatus:
      isAuthenticated && connectionStatusStreamId === streamId
        ? connectionStatus
        : isAuthenticated && streamId
          ? 'connecting'
          : 'idle',
    isConnected: isAuthenticated && connectedStreamId === streamId && connectionStatus === 'connected',
    isLoading: Boolean(streamId && isAuthenticated) && loadedStreamId !== streamId,
    messages: visibleMessages,
    sendMessage,
  }
}
