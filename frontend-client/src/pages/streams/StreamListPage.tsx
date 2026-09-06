import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'

import { Spinner } from '../../components/ui/Spinner'
import { StreamCard } from '../../features/stream/components/list/StreamCard'
import { useStreams } from '../../features/stream/hooks/useStreams'
import type { StreamCategory } from '../../features/stream/types/stream.types'

type CategoryFilter = 'All' | StreamCategory

const categories: CategoryFilter[] = ['All', 'Gaming', 'Music', 'Creative']

export function StreamListPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All')
  const { error, isLoading, streams } = useStreams()
  const visibleStreams = selectedCategory === 'All'
    ? streams
    : streams.filter((stream) => stream.category === selectedCategory)

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand">Discovery</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-copy">Live streams</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-copy-muted">Browse a hand-picked selection of creators who are live right now.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <LayoutGrid className="size-4" aria-hidden="true" />
          {streams.length} channels live
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Stream categories">
        {categories.map((category) => (
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-brand text-ink-950' : 'bg-surface text-copy-muted hover:bg-surface-muted hover:text-copy'}`}
            key={category}
            onClick={() => setSelectedCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? <Spinner label="Loading streams" /> : null}
      {error ? <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p> : null}
      {!isLoading && !error && visibleStreams.length === 0 ? <p className="rounded-xl border border-border bg-surface p-6 text-sm text-copy-muted">No streams found in this category.</p> : null}
      {!isLoading && !error && visibleStreams.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleStreams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}
        </div>
      ) : null}
    </div>
  )
}
