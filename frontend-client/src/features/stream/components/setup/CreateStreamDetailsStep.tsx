import { ShieldCheck, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { paths } from '../../../../routes/paths'
import type { CreateStreamController } from '../../hooks/useCreateStream'

type DetailsStepProps = Pick<
  CreateStreamController,
  | 'categoryError'
  | 'childCategories'
  | 'errors'
  | 'formError'
  | 'handleBlur'
  | 'handleChange'
  | 'handleParentChange'
  | 'handleSubmit'
  | 'isLoadingCategories'
  | 'isSubmitting'
  | 'isValid'
  | 'parentCategories'
  | 'selectedParentId'
  | 'values'
>

export function CreateStreamDetailsStep({
  categoryError,
  childCategories,
  errors,
  formError,
  handleBlur,
  handleChange,
  handleParentChange,
  handleSubmit,
  isLoadingCategories,
  isSubmitting,
  isValid,
  parentCategories,
  selectedParentId,
  values,
}: DetailsStepProps) {
  return (
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
  )
}
