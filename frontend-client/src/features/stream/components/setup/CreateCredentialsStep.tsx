import { Radio, ShieldCheck } from 'lucide-react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { paths } from '../../../../routes/paths'
import { useCreateStream } from '../../hooks/useCreateStream'
import { useStreamCategories } from '../../hooks/useStreamCategories'
import type { StreamProvisionResponse } from '../../types/stream.types'

interface CreateCredentialsStepProps {
  onCreated: (stream: StreamProvisionResponse) => void
}

export function CreateCredentialsStep({ onCreated }: CreateCredentialsStepProps) {
  const create = useCreateStream()
  const categories = useStreamCategories(create.selectedParentId)
  const isCategoryReady = !categories.categoryError && !categories.isLoadingCategories
  const { categoryError, isLoadingCategories } = categories
  const {
    errors,
    formError,
    handleBlur,
    handleChange,
    handleParentChange,
    isSubmitting,
    isValid,
    selectedParentId,
    values,
  } = create

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    create.clearFormError()

    const createdStream = await create.create(isCategoryReady)
    if (createdStream) onCreated(createdStream)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form
        className="grid gap-6 rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-black/10 sm:p-8"
        noValidate
        onSubmit={handleCreate}
      >
        {formError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            autoComplete="off"
            error={errors.title}
            id="stream-title"
            label="Title"
            maxLength={200}
            name="title"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Friday coding session"
            required
            value={values.title}
          />
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
              {categories.parentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-copy" htmlFor="stream-category-id">
          Category
          <select
            aria-describedby={categoryError || errors.categoryId ? 'stream-category-error' : undefined}
            aria-invalid={errors.categoryId ? true : undefined}
            className={`w-full rounded-xl border bg-surface-muted px-3.5 py-3 text-copy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${errors.categoryId ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}`}
            disabled={!isCategoryReady || Boolean(categoryError) || !selectedParentId}
            id="stream-category-id"
            name="categoryId"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.categoryId}
          >
            <option value="">{!selectedParentId ? 'Select a category group first' : 'Select a category'}</option>
            {categories.childCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoryError ? (
            <span className="text-xs font-normal text-danger" id="stream-category-error">
              {categoryError}
            </span>
          ) : null}
          {!categoryError && errors.categoryId ? (
            <span className="text-xs font-normal text-danger" id="stream-category-error">
              {errors.categoryId}
            </span>
          ) : null}
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
          {errors.description ? (
            <span className="text-xs font-normal text-danger" id="stream-description-error">
              {errors.description}
            </span>
          ) : null}
        </label>

        <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-copy-muted">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
          <p>Credentials are generated by the server and shown only in this private setup flow.</p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-copy-muted hover:text-copy"
            to={paths.studio}
          >
            Cancel
          </Link>
          <Button disabled={!isValid || !isCategoryReady} isLoading={isSubmitting} type="submit">
            Create credentials <Radio aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </form>

      <aside className="self-start rounded-3xl border border-border bg-surface-muted p-5 lg:sticky lg:top-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">What happens next</p>
        <p className="mt-4 text-sm leading-6 text-copy-muted">
          After creation, you can attach a thumbnail and configure the encoder with the private credentials.
        </p>
      </aside>
    </div>
  )
}
