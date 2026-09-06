import type { FormEvent } from 'react'
import { ArrowRight, Check, LockKeyhole, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { paths } from '../../routes/paths'

export function LoginPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(paths.home)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-brand-readable/25 bg-brand-light text-brand-readable">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-brand-readable">Welcome back</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-copy sm:text-[2.75rem]">Pick up where your room left off.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-copy-muted">Sign in to keep up with the conversations and creators that matter to you.</p>
      </div>

      <form className="rounded-[2rem] border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <Input autoComplete="email" id="email" label="Email address" name="email" placeholder="you@example.com" required type="email" />
          <Input autoComplete="current-password" id="password" label="Password" name="password" placeholder="Enter your password" required type="password" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-xs text-copy-muted">
          <label className="flex cursor-pointer items-center gap-2">
            <input className="size-4 rounded border-border bg-surface-muted accent-brand" type="checkbox" />
            Keep me signed in
          </label>
          <span className="text-brand-readable">Secure sign-in</span>
        </div>

        <Button className="mt-7 w-full justify-between" type="submit">
          <span>Enter your room</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-copy-muted">
          <LockKeyhole className="size-3.5 text-brand-readable" aria-hidden="true" />
          Your session is protected
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-copy-muted">
        New to Streamline?{' '}
        <Link className="font-semibold text-brand-readable underline-offset-4 hover:underline" to={paths.register}>
          Create an account
        </Link>
      </p>

      <div className="mt-10 flex items-center gap-3 text-xs text-copy-muted">
        <Check className="size-4 shrink-0 text-brand-readable" aria-hidden="true" />
        No noise, no clutter, just the streams you choose.
      </div>
    </div>
  )
}
