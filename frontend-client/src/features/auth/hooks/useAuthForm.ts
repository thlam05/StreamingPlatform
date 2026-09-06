import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { PATHS } from "@/routes/paths";
import { getApiErrorMessage } from "@/utils/apiError";

import { authService } from "../services/authService";
import type { AuthFormValues, AuthMode } from "../types";

const initialFormValues: AuthFormValues = {
  username: "",
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function useAuthForm(mode: AuthMode) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [values, setValues] = useState<AuthFormValues>(initialFormValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField(field: keyof AuthFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (isRegister && values.password !== values.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        await authService.register({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
          displayName: values.displayName.trim(),
        });
      } else {
        await authService.login({ email: values.email.trim(), password: values.password });
      }

      navigate(PATHS.PUBLIC.HOME, { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          isRegister ? "Đăng ký không thành công." : "Đăng nhập không thành công.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    values,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    errorMessage,
    updateField,
    togglePassword: () => setShowPassword((current) => !current),
    toggleConfirmPassword: () => setShowConfirmPassword((current) => !current),
    handleSubmit,
  };
}
