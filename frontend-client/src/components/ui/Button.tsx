import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-primary-foreground hover:brightness-95",
  ghost:
    "border-border bg-accent text-accent-foreground hover:border-primary/50 hover:bg-primary-light hover:text-foreground",
  danger: "border-danger bg-danger text-primary-foreground hover:brightness-95",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  className,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        fullWidth && "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
