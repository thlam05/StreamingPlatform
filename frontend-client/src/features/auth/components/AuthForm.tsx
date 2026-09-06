import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { useAuthForm } from "../hooks/useAuthForm";
import type { AuthMode } from "../types";
import { AuthPasswordInput } from "./AuthPasswordInput";

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const {
    values,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    errorMessage,
    updateField,
    togglePassword,
    toggleConfirmPassword,
    handleSubmit,
  } = useAuthForm(mode);

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      {isRegister && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="displayName"
            label="Tên hiển thị"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            value={values.displayName}
            onChange={(event) => updateField("displayName", event.target.value)}
            maxLength={100}
            required
          />
          <Input
            name="username"
            label="Username"
            type="text"
            autoComplete="username"
            placeholder="nguyenvana"
            value={values.username}
            onChange={(event) => updateField("username", event.target.value)}
            maxLength={50}
            required
          />
        </div>
      )}

      <Input
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        onChange={(event) => updateField("email", event.target.value)}
        maxLength={255}
        required
      />

      <AuthPasswordInput
        id="password"
        label="Mật khẩu"
        value={values.password}
        placeholder="Tối thiểu 8 ký tự"
        autoComplete={isRegister ? "new-password" : "current-password"}
        visible={showPassword}
        onChange={(value) => updateField("password", value)}
        onToggleVisibility={togglePassword}
        minLength={isRegister ? 8 : undefined}
      />

      {isRegister && (
        <AuthPasswordInput
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          value={values.confirmPassword}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          visible={showConfirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
          onToggleVisibility={toggleConfirmPassword}
          minLength={8}
        />
      )}

      {errorMessage && (
        <div
          className="rounded-xl border border-danger/25 bg-danger-light px-4 py-3 text-sm leading-6 text-danger"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <Button type="submit" fullWidth loading={isSubmitting}>
        {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
      </Button>
    </form>
  );
}
