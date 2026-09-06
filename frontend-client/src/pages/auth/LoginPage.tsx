import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <form className="rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8" onSubmit={handleSubmit}>
      <p className="text-sm font-semibold text-brand">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-copy">Sign in to Streamline</h1>
      <p className="mt-3 text-sm leading-6 text-copy-muted">This sample form demonstrates the shared Input and Button components.</p>
      <div className="mt-7 grid gap-4">
        <Input autoComplete="email" id="email" label="Email address" name="email" placeholder="you@example.com" required type="email" />
        <Input autoComplete="current-password" id="password" label="Password" name="password" placeholder="••••••••" required type="password" />
      </div>
      <Button className="mt-6 w-full" type="submit">Continue</Button>
    </form>
  )
}
