import { ArrowRight, CheckCircle2, CircleAlert, LockKeyhole, Radio, Server, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { paths } from '../../../../routes/paths'
import type { CreateStreamController, StreamSetupPhase } from '../../hooks/useCreateStream'
import type { CredentialName } from '../../hooks/useCredentialClipboard'
import { CredentialField } from './CredentialField'

type CredentialsStepProps = Pick<
  CreateStreamController,
  | 'checkConnection'
  | 'connectionError'
  | 'encoderReady'
  | 'isCheckingConnection'
  | 'phase'
  | 'preflightError'
  | 'setEncoderReady'
  | 'startWaitingForSignal'
> & {
  copiedCredential: CredentialName | null
  copyError: string | null
  createdStream: NonNullable<CreateStreamController['createdStream']>
  handleCopy: (name: CredentialName, value: string) => Promise<void>
  onReset: () => void
  streamKeyVisible: boolean
  toggleStreamKeyVisibility: () => void
}

const CONNECTION_PHASES: StreamSetupPhase[] = ['credentials', 'checking_connection', 'ready_to_start']

export function CredentialsStep({
  checkConnection,
  connectionError,
  copiedCredential,
  copyError,
  createdStream,
  encoderReady,
  handleCopy,
  isCheckingConnection,
  onReset,
  phase,
  preflightError,
  setEncoderReady,
  startWaitingForSignal,
  streamKeyVisible,
  toggleStreamKeyVisibility,
}: CredentialsStepProps) {
  const isLive = phase === 'live'
  const isWaitingForSignal = phase === 'waiting_for_signal'

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-live="polite">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/10">
        <header className="border-b border-border bg-surface-muted/40 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className={`grid size-11 shrink-0 place-items-center rounded-2xl ${isLive ? 'bg-success/15 text-success' : 'bg-brand/10 text-brand'}`}>
              {isLive ? <CheckCircle2 className="size-5" aria-hidden="true" /> : <Radio className="size-5" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${isLive ? 'text-success' : 'text-brand'}`}>{isLive ? 'Broadcast active' : 'Connection setup'}</p>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${isLive ? 'border-success/30 bg-success/10 text-success' : isWaitingForSignal ? 'border-warning/30 bg-warning/10 text-warning' : 'border-border bg-surface text-copy-muted'}`}>
                  <span className={`size-1.5 rounded-full ${isLive ? 'bg-success' : isWaitingForSignal ? 'bg-warning' : 'bg-copy-muted'}`} aria-hidden="true" />
                  {isLive ? 'Live now' : isWaitingForSignal ? 'Waiting for signal' : 'Private setup'}
                </span>
              </div>
              <h2 className="mt-3 truncate text-2xl font-semibold tracking-tight text-copy sm:text-3xl">{createdStream.stream.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-copy-muted">
                {isLive ? 'The ingest service confirmed a valid media feed. Your livestream is now available to viewers.' : 'Use the credentials below in your encoder. The key stays hidden until you choose to reveal it.'}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-7 p-6 sm:p-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copy-muted">Encoder credentials</p>
                <h3 className="mt-2 text-lg font-semibold text-copy">Connect your broadcast software</h3>
              </div>
              <LockKeyhole className="mt-1 size-5 shrink-0 text-copy-muted" aria-hidden="true" />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-copy-muted">Paste the server URL and stream key into OBS or another supported encoder.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CredentialField copied={copiedCredential === 'rtmpUrl'} name="rtmpUrl" onCopy={handleCopy} value={createdStream.rtmpUrl} />
            <CredentialField copied={copiedCredential === 'streamKey'} name="streamKey" onCopy={handleCopy} onToggleVisibility={toggleStreamKeyVisibility} value={createdStream.streamKey} visible={streamKeyVisible} />
          </div>
          {copyError ? <p className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning" role="alert"><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{copyError}</p> : null}

          <div className="rounded-2xl border border-border p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Server className="size-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copy-muted">Quick setup</p>
                <h3 className="mt-1 font-semibold text-copy">Configure the broadcaster</h3>
              </div>
            </div>
            <ol className="mt-5 grid gap-3 text-sm leading-6 text-copy-muted sm:grid-cols-3 sm:gap-4">
              <li className="flex gap-3 sm:block"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-semibold text-brand sm:mb-3">1</span><span>Open OBS or another supported encoder.</span></li>
              <li className="flex gap-3 sm:block"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-semibold text-brand sm:mb-3">2</span><span>Paste the Stream URL into the Server field.</span></li>
              <li className="flex gap-3 sm:block"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-semibold text-brand sm:mb-3">3</span><span>Paste the Stream key into the matching field.</span></li>
            </ol>
          </div>

          {CONNECTION_PHASES.includes(phase) ? (
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Connection check</p>
                  <h3 className="mt-2 font-semibold text-copy">Confirm the scheduled stream is ready</h3>
                  <p className="mt-1 text-sm leading-6 text-copy-muted">This check does not mark the stream live. The ingest service remains the source of truth.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-copy-muted"><CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />Backend credentials are available.</div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-copy-muted">{phase === 'ready_to_start' ? <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" /> : <CircleAlert className="size-4 shrink-0 text-warning" aria-hidden="true" />}Server confirms the stream is scheduled.</div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-3 text-copy-muted transition-colors hover:border-brand/50">
                  <input checked={encoderReady} className="mt-0.5 size-4 rounded border-border accent-brand" onChange={(event) => setEncoderReady(event.currentTarget.checked)} type="checkbox" />
                  <span>I have entered the Stream URL and Stream key in my encoder.</span>
                </label>
              </div>
              {preflightError ? <p className="mt-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert"><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{preflightError}</p> : null}
              <div className="mt-5 flex flex-wrap gap-3 border-t border-brand/20 pt-5">
                <Button disabled={phase === 'ready_to_start' || phase === 'checking_connection'} isLoading={isCheckingConnection} onClick={checkConnection} variant="secondary">Check connection</Button>
                <Button disabled={phase !== 'ready_to_start' || !encoderReady} onClick={startWaitingForSignal}>Start livestream</Button>
              </div>
            </div>
          ) : null}

          {isWaitingForSignal ? (
            <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-5 text-sm text-copy-muted" role="status">
              <Radio className="mt-0.5 size-5 shrink-0 animate-pulse text-warning" aria-hidden="true" />
              <p><span className="font-semibold text-copy">Waiting for signal.</span> Start the encoder now. We will update this screen when the ingest service confirms valid media.</p>
            </div>
          ) : null}

          {connectionError ? <p className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert"><CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{connectionError}</p> : null}
          {isLive ? <Link className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:bg-brand-strong active:scale-[0.98]" to={paths.streams}>View live streams<ArrowRight className="size-4" aria-hidden="true" /></Link> : null}
        </div>
      </div>

      <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">Private channel</p>
        </div>
        <h2 className="mt-3 text-lg font-semibold text-copy">Keep the stream key secret</h2>
        <p className="mt-3 text-sm leading-6 text-copy-muted">Treat it like a password. Never share it in a URL, chat message, screenshot, log, or viewer-facing page.</p>
        <div className="mt-5 grid gap-2 border-t border-border pt-5 text-sm text-copy-muted">
          <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" aria-hidden="true" />Visible only in this setup flow</p>
          <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" aria-hidden="true" />Ready for one active encoder</p>
        </div>
        <Button className="mt-6 w-full" onClick={onReset} variant="secondary">Create another stream</Button>
      </aside>
    </section>
  )
}
