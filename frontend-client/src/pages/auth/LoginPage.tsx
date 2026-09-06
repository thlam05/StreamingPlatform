import type { FormEvent } from 'react'
import { ArrowRight, KeyRound } from 'lucide-react'
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
    <section>
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-brand-readable">Sign in</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-copy sm:text-4xl">Welcome back.</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-copy-muted">Sign in to continue to your favorite rooms.</p>
      </div>

      <form className="mx-auto w-full max-w-[28rem] rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/10 sm:p-7" onSubmit={handleSubmit}>
        <nav className="grid grid-cols-2 rounded-full border border-border bg-surface-muted p-1 text-sm font-semibold" aria-label="Authentication">
          <span className="rounded-full bg-brand px-3 py-2 text-center text-primary-foreground shadow-sm">Sign in</span>
          <Link className="rounded-full px-3 py-2 text-center text-copy-muted transition-colors hover:text-copy" to={paths.register}>Register</Link>
        </nav>

        <div className="mt-6 grid gap-4">
          <Input autoComplete="email" id="email" label="Email address" name="email" placeholder="you@example.com" required type="email" />
          <Input autoComplete="current-password" id="password" label="Password" name="password" placeholder="Enter your password" required type="password" />
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-copy-muted">
          <input className="size-4 rounded border-border bg-surface-muted accent-brand" type="checkbox" />
          Keep me signed in
        </label>

        <Button className="mt-6 w-full justify-between" type="submit">
          <span>Continue to Streamline</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-copy-muted">
          <KeyRound className="size-3.5 text-brand-readable" aria-hidden="true" />
          Your sign-in stays private
        </div>
      </form>
    </section>
  )
}
