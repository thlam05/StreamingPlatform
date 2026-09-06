import { Input } from "@/components/ui/Input";

interface AuthPasswordInputProps {
  id: "password" | "confirmPassword";
  label: string;
  value: string;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  visible: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  minLength?: number;
}

export function AuthPasswordInput({
  id,
  label,
  value,
  placeholder,
  autoComplete,
  visible,
  onChange,
  onToggleVisibility,
  minLength,
}: AuthPasswordInputProps) {
  return (
    <Input
      id={id}
      name={id}
      label={label}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      minLength={minLength}
      maxLength={100}
      required
      endAdornment={
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={onToggleVisibility}
          aria-label={visible ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? "Ẩn" : "Hiện"}
        </button>
      }
    />
  );
}
