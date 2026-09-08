import type { FormEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { paths } from '../../../routes/paths'

type AuthMode = 'login' | 'register'

interface AuthFormShellProps {
  children: ReactNode
  description: string
  formError: string | null
  mode: AuthMode
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
}

export function AuthFormShell({ children, description, formError, mode, onSubmit, title }: AuthFormShellProps) {
  return (
    <section>
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-brand-readable">{mode === 'login' ? 'Sign in' : 'Register'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-copy sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-copy-muted">{description}</p>
      </div>

      <form className="mx-auto w-full max-w-[28rem] rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/10 sm:p-7" onSubmit={onSubmit} noValidate>
        <nav className="grid grid-cols-2 rounded-full border border-border bg-surface-muted p-1 text-sm font-semibold" aria-label="Authentication">
          {mode === 'login' ? (
            <span className="rounded-full bg-brand px-3 py-2 text-center text-primary-foreground shadow-sm">Sign in</span>
          ) : (
            <Link className="rounded-full px-3 py-2 text-center text-copy-muted transition-colors hover:text-copy" to={paths.login}>Sign in</Link>
          )}
          {mode === 'register' ? (
            <span className="rounded-full bg-brand px-3 py-2 text-center text-primary-foreground shadow-sm">Register</span>
          ) : (
            <Link className="rounded-full px-3 py-2 text-center text-copy-muted transition-colors hover:text-copy" to={paths.register}>Register</Link>
          )}
        </nav>

        {formError ? <p className="mt-5 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger" role="alert">{formError}</p> : null}
        <div className="mt-6 grid gap-4">{children}</div>
      </form>
    </section>
  )
}
