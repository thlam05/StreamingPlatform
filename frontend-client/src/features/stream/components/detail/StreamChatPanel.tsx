import { MessageCircle, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { Spinner } from '../../../../components/ui/Spinner'
import { paths } from '../../../../routes/paths'
import { useStreamChat } from '../../hooks/useStreamChat'

interface StreamChatPanelProps {
  isAvailable: boolean
  streamId: string | undefined
}

export function StreamChatPanel({ isAvailable, streamId }: StreamChatPanelProps) {
  const [draft, setDraft] = useState('')
  const { connectionStatus, error, isAuthenticated, isLoading, messages, sendMessage } = useStreamChat(
    isAvailable ? streamId : undefined,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = draft.trim()
    if (!message) return
    if (await sendMessage(message)) setDraft('')
  }

  return (
    <aside
      className="flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface xl:sticky xl:top-6"
      aria-label="Livestream chat"
    >
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold text-copy">Live chat</h2>
          <p className="mt-1 text-xs text-copy-muted">
            {!isAvailable
              ? 'Chat is unavailable after the livestream ends'
              : connectionStatus === 'connected'
                ? 'Connected'
                : connectionStatus === 'disconnected'
                  ? 'Disconnected — retrying…'
                  : isAuthenticated
                    ? 'Connecting…'
                    : 'Sign in to join the conversation'}
          </p>
        </div>
        <MessageCircle className="size-5 text-brand" aria-hidden="true" />
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {!isAvailable ? (
          <p className="rounded-xl bg-surface-muted p-3 text-sm text-copy-muted">
            Chat is available while the stream is live.
          </p>
        ) : null}
        {isAvailable && isLoading ? <Spinner label="Loading chat" /> : null}
        {error ? <p className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}
        {isAvailable && !isLoading && messages.length === 0 ? (
          <div className="grid h-full min-h-56 place-items-center text-center">
            <div className="max-w-52">
              <MessageCircle className="mx-auto size-8 text-copy-muted/70" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-copy">No messages yet</p>
              <p className="mt-1 text-xs leading-5 text-copy-muted">Be the first person to say hello.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div className="rounded-xl bg-surface-muted px-3 py-2" key={message.id}>
              <p className="text-xs font-semibold text-brand">
                {message.sender.displayName || message.sender.username}
              </p>
              <p className="mt-1 break-words text-sm leading-5 text-copy">{message.message}</p>
            </div>
          ))
        )}
      </div>

      {isAvailable && isAuthenticated ? (
        <form className="border-t border-border p-4" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="stream-chat-message">
            Chat message
          </label>
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-copy outline-none placeholder:text-copy-muted focus:border-brand"
              id="stream-chat-message"
              maxLength={500}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Send a message"
              value={draft}
            />
            <Button aria-label="Send chat message" disabled={!draft.trim()} type="submit">
              <Send className="size-4" aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="border-t border-border p-4">
          <Link
            className="block rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            to={paths.login}
          >
            Sign in to chat
          </Link>
        </div>
      )}
    </aside>
  )
}
