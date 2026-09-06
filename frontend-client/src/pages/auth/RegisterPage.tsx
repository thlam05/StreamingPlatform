import type { FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { paths } from "../../routes/paths";

export function RegisterPage() {
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(paths.home);
  }

  return (
    <section>
      <div className="mb-7 text-center">
        <p className="text-sm font-semibold text-brand-readable">Register</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-copy sm:text-4xl">
          Make your room.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-copy-muted">
          Create an account and start finding rooms worth returning to.
        </p>
      </div>

      <form
        className="mx-auto w-full max-w-[28rem] rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/10 sm:p-7"
        onSubmit={handleSubmit}
      >
        <nav
          className="grid grid-cols-2 rounded-full border border-border bg-surface-muted p-1 text-sm font-semibold"
          aria-label="Authentication"
        >
          <Link
            className="rounded-full px-3 py-2 text-center text-copy-muted transition-colors hover:text-copy"
            to={paths.login}
          >
            Sign in
          </Link>
          <span className="rounded-full bg-brand px-3 py-2 text-center text-primary-foreground shadow-sm">
            Register
          </span>
        </nav>

        <div className="mt-6 grid gap-4">
          <Input
            autoComplete="name"
            id="display-name"
            label="Display name"
            name="displayName"
            placeholder="Your name"
            required
          />
          <Input
            autoComplete="email"
            id="register-email"
            label="Email address"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              autoComplete="new-password"
              id="register-password"
              label="Password"
              name="password"
              placeholder="Create a password"
              required
              type="password"
            />
            <Input
              autoComplete="new-password"
              id="confirm-password"
              label="Confirm password"
              name="confirmPassword"
              placeholder="Repeat password"
              required
              type="password"
            />
          </div>
        </div>

        <Button className="mt-6 w-full justify-between" type="submit">
          <span>Create my account</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <p className="mt-4 text-center text-xs leading-5 text-copy-muted">
          By continuing, you agree to use Streamline respectfully.
        </p>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-copy-muted">
        {["Choose your rooms", "Follow live topics", "Come back anytime"].map(
          (item) => (
            <span className="inline-flex items-center gap-1.5" key={item}>
              <Check
                className="size-3.5 text-brand-readable"
                aria-hidden="true"
              />
              {item}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
