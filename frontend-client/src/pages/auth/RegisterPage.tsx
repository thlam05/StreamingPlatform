import type { FormEvent } from 'react'
import { ArrowRight, Check, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { paths } from '../../routes/paths'

export function RegisterPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(paths.home)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-brand-readable/25 bg-brand-light text-brand-readable">
          <UserRound className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-brand-readable">Start your signal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-copy sm:text-[2.75rem]">Make room for what matters.</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-copy-muted">Create your account and shape a live space around the people, topics, and moments you care about.</p>
      </div>

      <form className="rounded-[2rem] border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <Input autoComplete="name" id="display-name" label="Display name" name="displayName" placeholder="What should we call you?" required />
          <Input autoComplete="email" id="register-email" label="Email address" name="email" placeholder="you@example.com" required type="email" />
          <Input autoComplete="new-password" id="register-password" label="Password" name="password" placeholder="Create a secure password" required type="password" />
          <Input autoComplete="new-password" id="confirm-password" label="Confirm password" name="confirmPassword" placeholder="Repeat your password" required type="password" />
        </div>

        <Button className="mt-7 w-full justify-between" type="submit">
          <span>Create your account</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <p className="mt-4 text-center text-xs leading-5 text-copy-muted">
          By continuing, you agree to keep this space respectful and real.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-copy-muted">
        Already have an account?{' '}
        <Link className="font-semibold text-brand-readable underline-offset-4 hover:underline" to={paths.login}>
          Sign in
        </Link>
      </p>

      <div className="mt-10 grid gap-3 text-xs text-copy-muted sm:grid-cols-3 sm:gap-2">
        {['Follow your signal', 'Find your people', 'Stay in the moment'].map((item) => (
          <div className="flex items-center gap-2" key={item}>
            <Check className="size-3.5 shrink-0 text-brand-readable" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
