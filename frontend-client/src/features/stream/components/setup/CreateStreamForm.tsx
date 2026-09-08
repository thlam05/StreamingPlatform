import { ArrowLeft, Check, CheckCircle2, CircleAlert, Copy, Eye, EyeOff, ImagePlus, KeyRound, Radio, Server, ShieldCheck, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { paths } from '../../../../routes/paths'
import { useCreateStream, type StreamSetupPhase } from '../../hooks/useCreateStream'

type CredentialName = 'rtmpUrl' | 'streamKey'

interface CredentialFieldProps {
  copied: boolean
  name: CredentialName
  onCopy: (name: CredentialName, value: string) => void
  onToggleVisibility?: () => void
  value: string
  visible?: boolean
}

function CredentialField({ copied, name, onCopy, onToggleVisibility, value, visible = true }: CredentialFieldProps) {
  const label = name === 'rtmpUrl' ? 'Stream URL' : 'Stream key'
  const displayedValue = visible ? value : '••••••••••••••••••••••••'

  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-copy-muted">
          {name === 'rtmpUrl' ? <Server className="size-3.5 text-brand" aria-hidden="true" /> : <KeyRound className="size-3.5 text-warning" aria-hidden="true" />}
          {label}
        </p>
        <div className="flex items-center gap-1">
          {onToggleVisibility ? (
            <button
              aria-label={visible ? 'Hide stream key' : 'Show stream key'}
              className="grid size-8 place-items-center rounded-lg text-copy-muted transition-colors hover:bg-surface hover:text-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              onClick={onToggleVisibility}
              type="button"
            >
              {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            </button>
          ) : null}
          <button
            aria-label={`Copy ${label.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-copy-muted transition-colors hover:bg-surface hover:text-copy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            onClick={() => onCopy(name, value)}
            type="button"
          >
            {copied ? <Check className="size-3.5 text-success" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <p className={`mt-3 break-all font-mono text-sm ${visible ? 'text-copy' : 'text-copy-muted'}`}>{displayedValue}</p>
    </div>
  )
}

function PhaseRail({ phase }: { phase: StreamSetupPhase }) {
  const phaseItems = [
    { active: phase === 'editing', complete: phase !== 'editing', label: 'Create credentials' },
    { active: phase === 'thumbnail', complete: ['credentials', 'checking_connection', 'ready_to_start', 'waiting_for_signal', 'live'].includes(phase), label: 'Upload thumbnail' },
    { active: phase === 'credentials' || phase === 'checking_connection' || phase === 'ready_to_start', complete: phase === 'waiting_for_signal' || phase === 'live', label: 'Check connection' },
    { active: phase === 'waiting_for_signal' || phase === 'live', complete: phase === 'live', label: 'Start livestream' },
  ]

  return (
    <ol className="grid gap-2 sm:grid-cols-4" aria-label="Livestream setup progress">
      {phaseItems.map(({ active, complete, label }, index) => (
        <li className={`flex items-center gap-2 text-xs font-semibold ${active ? 'text-brand' : complete ? 'text-success' : 'text-copy-muted'}`} key={label}>
          <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${active ? 'border-brand bg-brand text-primary-foreground' : complete ? 'border-success/50 bg-success/10 text-success' : 'border-border bg-surface text-copy-muted'}`}>
            {complete ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
          </span>
          <span className="leading-4">{label}</span>
          {index < phaseItems.length - 1 ? <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  )
}

export function CreateStreamForm() {
  const {
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
    phase,
    parentCategories,
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
  } = useCreateStream()
  const [streamKeyVisible, setStreamKeyVisible] = useState(false)
  const [copiedCredential, setCopiedCredential] = useState<CredentialName | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)

  async function handleCopy(name: CredentialName, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedCredential(name)
      setCopyError(null)
      window.setTimeout(() => setCopiedCredential(null), 2000)
    } catch {
      setCopyError('Copy failed. Select the value and copy it manually.')
    }
  }

  function handleReset() {
    resetForm()
    setStreamKeyVisible(false)
    setCopiedCredential(null)
    setCopyError(null)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand">Creator studio</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">Create a livestream</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-copy-muted">Create the room, add a thumbnail, check your connection, then start broadcasting.</p>
        </div>
        <Link className="inline-flex items-center gap-2 self-start text-sm font-semibold text-copy-muted hover:text-copy sm:self-auto" to={paths.streams}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to streams
        </Link>
      </div>

      <PhaseRail phase={phase} />

      {phase === 'editing' ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <form className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/10 sm:p-8" onSubmit={handleSubmit} noValidate>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Step 1</p>
              <h2 className="mt-2 text-xl font-semibold text-copy">Create the stream credentials</h2>
              <p className="mt-1 text-sm leading-6 text-copy-muted">Give your livestream a clear identity. The server will create its publishing credentials after this step.</p>
            </div>

            {formError ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{formError}</p> : null}

            <div className="grid gap-5 md:grid-cols-2">
              <Input autoComplete="off" error={errors.title} id="stream-title" label="Title" maxLength={200} name="title" onBlur={handleBlur} onChange={handleChange} placeholder="Friday coding session" required value={values.title} />
              <label className="grid gap-2 text-sm font-medium text-copy" htmlFor="stream-category-parent">
                Category group
                <select
                  aria-busy={isLoadingCategories}
                  className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-3 text-copy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  disabled={isLoadingCategories || Boolean(categoryError)}
                  id="stream-category-parent"
                  onChange={handleParentChange}
                  value={selectedParentId}
                >
                  <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select a category group'}</option>
                  {parentCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-copy" htmlFor="stream-category-id">
              Category
              <select
                aria-describedby={categoryError || errors.categoryId ? 'stream-category-error' : undefined}
                aria-invalid={errors.categoryId ? true : undefined}
                className={`w-full rounded-xl border bg-surface-muted px-3.5 py-3 text-copy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${errors.categoryId ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}`}
                disabled={isLoadingCategories || Boolean(categoryError) || !selectedParentId}
                id="stream-category-id"
                name="categoryId"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.categoryId}
              >
                <option value="">{!selectedParentId ? 'Select a category group first' : 'Select a category'}</option>
                {childCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              {categoryError ? <span className="text-xs font-normal text-danger" id="stream-category-error">{categoryError}</span> : null}
              {!categoryError && errors.categoryId ? <span className="text-xs font-normal text-danger" id="stream-category-error">{errors.categoryId}</span> : null}
            </label>

            <label className="grid gap-2 text-sm font-medium text-copy" htmlFor="stream-description">
              Description
              <textarea
                aria-describedby={errors.description ? 'stream-description-error' : undefined}
                aria-invalid={errors.description ? true : undefined}
                className={`min-h-36 w-full resize-y rounded-xl border bg-surface-muted px-3.5 py-3 text-copy outline-none placeholder:text-copy-muted focus:border-brand focus:ring-2 focus:ring-brand/20 ${errors.description ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}`}
                id="stream-description"
                maxLength={5000}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Tell viewers what you will be sharing."
                value={values.description}
              />
              {errors.description ? <span className="text-xs font-normal text-danger" id="stream-description-error">{errors.description}</span> : null}
            </label>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-copy-muted">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
              <p>Credentials are generated by the server after the stream is created. They are shown only in the private setup flow.</p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-copy-muted hover:text-copy" to={paths.streams}>Cancel</Link>
              <Button disabled={!isValid} isLoading={isSubmitting} type="submit">
                Create credentials
                <Radio className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </form>

          <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">What happens next</p>
            <div className="mt-4 grid gap-4 text-sm leading-6 text-copy-muted">
              <p><span className="font-semibold text-copy">Create.</span> The backend creates a scheduled stream and provisions one active credential.</p>
              <p><span className="font-semibold text-copy">Prepare.</span> You will receive the stream URL and key after the thumbnail step.</p>
              <p><span className="font-semibold text-copy">Publish.</span> The stream becomes live only after valid media reaches ingest.</p>
            </div>
          </aside>
        </div>
      ) : null}

      {phase === 'thumbnail' && createdStream ? (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/10 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Step 2</p>
              <h2 className="mt-2 text-xl font-semibold text-copy">Upload a thumbnail</h2>
              <p className="mt-1 text-sm leading-6 text-copy-muted">Choose an image that gives viewers a useful preview before you configure the broadcast connection.</p>
            </div>

            <label className="grid cursor-pointer gap-4 rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-5 transition-colors hover:bg-brand/10" htmlFor="stream-thumbnail-file">
              {thumbnailPreviewUrl ? <img alt="Selected livestream thumbnail preview" className="aspect-video w-full rounded-xl object-cover" src={thumbnailPreviewUrl} /> : <span className="grid aspect-video place-items-center rounded-xl border border-border bg-surface-muted text-copy-muted"><ImagePlus className="size-8" aria-hidden="true" /></span>}
              <span className="flex items-center justify-center gap-2 text-sm font-semibold text-brand"><UploadCloud className="size-4" aria-hidden="true" />{thumbnailFile ? 'Choose a different image' : 'Choose an image'}</span>
              <input accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" id="stream-thumbnail-file" onChange={(event) => selectThumbnail(event.currentTarget.files?.[0])} type="file" />
            </label>

            <div className="text-sm text-copy-muted">
              {thumbnailFile ? <p className="font-medium text-copy">{thumbnailFile.name}</p> : null}
              <p className="mt-1">JPEG, PNG, WebP, or GIF. Maximum file size: 5 MB.</p>
            </div>
            {thumbnailError ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{thumbnailError}</p> : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button onClick={skipThumbnail} variant="secondary">Continue without thumbnail</Button>
              <Button disabled={!thumbnailFile} isLoading={isUploadingThumbnail} onClick={submitThumbnail}>
                Upload thumbnail
                <UploadCloud className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Thumbnail guidance</p>
            <h2 className="mt-2 text-lg font-semibold text-copy">Make the preview readable</h2>
            <p className="mt-3 text-sm leading-6 text-copy-muted">Use a clear frame with enough contrast. The file is validated before it is attached to the stream metadata.</p>
          </aside>
        </section>
      ) : null}

      {createdStream && ['credentials', 'checking_connection', 'ready_to_start', 'waiting_for_signal', 'live'].includes(phase) ? (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-live="polite">
          <div className="space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/10 sm:p-8">
            <div className="flex items-start gap-3">
              {phase === 'live' ? <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden="true" /> : <Radio className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden="true" />}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${phase === 'live' ? 'text-success' : 'text-brand'}`}>{phase === 'live' ? 'Step 4' : 'Step 3'}</p>
                <h2 className="mt-2 text-2xl font-semibold text-copy">{createdStream.stream.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-copy-muted">
                  {phase === 'live' ? 'The ingest service confirmed a valid media feed. Your livestream is now available to viewers.' : 'Use the credentials from the backend in your encoder. The key stays hidden until you choose to reveal it.'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <CredentialField copied={copiedCredential === 'rtmpUrl'} name="rtmpUrl" onCopy={handleCopy} value={createdStream.rtmpUrl} />
              <CredentialField copied={copiedCredential === 'streamKey'} name="streamKey" onCopy={handleCopy} onToggleVisibility={() => setStreamKeyVisible((visible) => !visible)} value={createdStream.streamKey} visible={streamKeyVisible} />
            </div>
            {copyError ? <p className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning" role="alert">{copyError}</p> : null}

            <div className="rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2">
                <Server className="size-4 text-brand" aria-hidden="true" />
                <h3 className="font-semibold text-copy">Configure the broadcaster</h3>
              </div>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-copy-muted">
                <li className="flex gap-3"><span className="font-semibold text-brand">1</span> Open OBS or another supported encoder.</li>
                <li className="flex gap-3"><span className="font-semibold text-brand">2</span> Paste the Stream URL into the Server field.</li>
                <li className="flex gap-3"><span className="font-semibold text-brand">3</span> Paste the Stream key into the matching field.</li>
              </ol>
            </div>

            {['credentials', 'checking_connection', 'ready_to_start'].includes(phase) ? (
              <div className="grid gap-4 rounded-2xl border border-border bg-surface-muted p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Connection check</p>
                  <h3 className="mt-2 font-semibold text-copy">Confirm the scheduled stream is ready</h3>
                  <p className="mt-1 text-sm leading-6 text-copy-muted">This check does not mark the stream live. The ingest service remains the source of truth.</p>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3 text-copy-muted"><CheckCircle2 className="size-4 text-success" aria-hidden="true" />Backend credentials are available.</div>
                  <div className="flex items-center gap-3 text-copy-muted">{phase === 'ready_to_start' ? <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> : <CircleAlert className="size-4 text-warning" aria-hidden="true" />}Server confirms the stream is scheduled.</div>
                  <label className="flex cursor-pointer items-start gap-3 text-copy-muted">
                    <input checked={encoderReady} className="mt-0.5 size-4 rounded border-border accent-brand" onChange={(event) => setEncoderReady(event.currentTarget.checked)} type="checkbox" />
                    <span>I have entered the Stream URL and Stream key in my encoder.</span>
                  </label>
                </div>
                {preflightError ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{preflightError}</p> : null}
                <div className="flex flex-wrap gap-3">
                  <Button disabled={phase === 'ready_to_start' || phase === 'checking_connection'} isLoading={isCheckingConnection} onClick={checkConnection} variant="secondary">Check connection</Button>
                  <Button disabled={phase !== 'ready_to_start' || !encoderReady} onClick={startWaitingForSignal}>Start livestream</Button>
                </div>
              </div>
            ) : null}

            {phase === 'waiting_for_signal' ? (
              <div className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/10 p-5 text-sm text-copy-muted">
                <Radio className="mt-0.5 size-5 shrink-0 animate-pulse text-brand" aria-hidden="true" />
                <p><span className="font-semibold text-copy">Waiting for signal.</span> Start the encoder now. We will update this screen when the ingest service confirms valid media.</p>
              </div>
            ) : null}

            {connectionError ? <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{connectionError}</p> : null}
            {phase === 'live' ? <Link className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-strong" to={paths.streams}>View live streams</Link> : null}
          </div>

          <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Private credentials</p>
            <h2 className="mt-2 text-lg font-semibold text-copy">Keep the stream key secret</h2>
            <p className="mt-3 text-sm leading-6 text-copy-muted">Never share it in a URL, chat message, screenshot, log, or viewer-facing page.</p>
            <Button className="mt-5 w-full" onClick={handleReset} variant="secondary">Create another stream</Button>
          </aside>
        </section>
      ) : null}
    </div>
  )
}
