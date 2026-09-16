import { ArrowRight, Check } from 'lucide-react'

import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { AuthFormShell } from './AuthFormShell'

export function RegisterForm() {
  const { errors, formError, handleBlur, handleChange, handleSubmit, isSubmitting, values } = useRegisterForm()

  return (
    <>
      <AuthFormShell
        description="Create an account and start finding rooms worth returning to."
        formError={formError}
        mode="register"
        onSubmit={handleSubmit}
        title="Make your room."
      >
        <Input
          autoComplete="username"
          error={errors.username}
          id="username"
          label="Username"
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Choose a username"
          required
          value={values.username}
        />
        <Input
          autoComplete="name"
          error={errors.displayName}
          id="display-name"
          label="Display name"
          name="displayName"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Your name"
          required
          value={values.displayName}
        />
        <Input
          autoComplete="email"
          error={errors.email}
          id="register-email"
          label="Email address"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          type="email"
          value={values.email}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            autoComplete="new-password"
            error={errors.password}
            id="register-password"
            label="Password"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Create a password"
            required
            type="password"
            value={values.password}
          />
          <Input
            autoComplete="new-password"
            error={errors.confirmPassword}
            id="confirm-password"
            label="Confirm password"
            name="confirmPassword"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Repeat password"
            required
            type="password"
            value={values.confirmPassword}
          />
        </div>

        <Button className="mt-2 w-full justify-between" isLoading={isSubmitting} type="submit">
          <span>Create my account</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <p className="mt-1 text-center text-xs leading-5 text-copy-muted">
          By continuing, you agree to use Streamline respectfully.
        </p>
      </AuthFormShell>

      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-copy-muted">
        {['Choose your rooms', 'Follow live topics', 'Come back anytime'].map((item) => (
          <span className="inline-flex items-center gap-1.5" key={item}>
            <Check className="size-3.5 text-brand-readable" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </>
  )
}
