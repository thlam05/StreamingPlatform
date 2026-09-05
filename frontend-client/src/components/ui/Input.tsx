import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
}

export function Input({ label, helperText, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  const messageId = inputId ? `${inputId}-message` : undefined;

  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={messageId}
        className={[
          "h-11 w-full rounded-xl border border-border bg-accent px-3 text-foreground outline-none transition placeholder:text-secondary/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {(error || helperText) && (
        <span id={messageId} className={error ? "text-sm text-danger" : "text-sm text-secondary"}>
          {error || helperText}
        </span>
      )}
    </label>
  );
}
