import { ArrowRight, KeyRound } from 'lucide-react'

import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useLoginForm } from '../hooks/useLoginForm'
import { AuthFormShell } from './AuthFormShell'

export function LoginForm() {
  const { errors, formError, handleBlur, handleChange, handleSubmit, isSubmitting, values } = useLoginForm()

  return (
    <AuthFormShell
      description="Sign in to continue to your favorite rooms."
      formError={formError}
      mode="login"
      onSubmit={handleSubmit}
      title="Welcome back."
    >
      <Input autoComplete="email" error={errors.email} id="email" label="Email address" name="email" onBlur={handleBlur} onChange={handleChange} placeholder="you@example.com" required type="email" value={values.email} />
      <Input autoComplete="current-password" error={errors.password} id="password" label="Password" name="password" onBlur={handleBlur} onChange={handleChange} placeholder="Enter your password" required type="password" value={values.password} />

      <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-copy-muted">
        <input className="size-4 rounded border-border bg-surface-muted accent-brand" type="checkbox" />
        Keep me signed in
      </label>

      <Button className="mt-2 w-full justify-between" isLoading={isSubmitting} type="submit">
        <span>Continue to Streamline</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <div className="mt-1 flex items-center justify-center gap-2 text-xs text-copy-muted">
        <KeyRound className="size-3.5 text-brand-readable" aria-hidden="true" />
        Your sign-in stays private
      </div>
    </AuthFormShell>
  )
}
