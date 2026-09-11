import { ImagePlus, UploadCloud } from 'lucide-react'

import { Button } from '../../../../components/ui/Button'
import type { CreateStreamController } from '../../hooks/useCreateStream'

type ThumbnailStepProps = Pick<
  CreateStreamController,
  'isUploadingThumbnail' | 'selectThumbnail' | 'skipThumbnail' | 'submitThumbnail' | 'thumbnailError' | 'thumbnailFile' | 'thumbnailPreviewUrl'
>

export function ThumbnailStep({
  isUploadingThumbnail,
  selectThumbnail,
  skipThumbnail,
  submitThumbnail,
  thumbnailError,
  thumbnailFile,
  thumbnailPreviewUrl,
}: ThumbnailStepProps) {
  return (
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
  )
}
