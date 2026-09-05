import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/Button";
import { PATHS } from "@/routes/paths";
import { getApiErrorMessage } from "@/utils/apiError";

import { authService } from "../services/authService";

type AuthMode = "login" | "register";

interface AuthPageProps {
  mode: AuthMode;
}

interface FormValues {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormValues = {
  username: "",
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClasses =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-secondary focus:border-primary focus:ring-4 focus:ring-primary/15";

export function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrorMessage(null);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (isRegister && form.password !== form.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegister) {
        await authService.register({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          displayName: form.displayName.trim(),
        });
      } else {
        await authService.login({ email: form.email.trim(), password: form.password });
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/15" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border-[48px] border-white/10" />
          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <Link to={PATHS.PUBLIC.HOME} className="flex items-center gap-3 text-lg font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-lg">
                S
              </span>
              StreamingPlatform
            </Link>
            <div className="max-w-lg py-16">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                Your live world
              </p>
              <h1 className="text-4xl font-bold leading-tight xl:text-6xl">
                Kết nối với những điều bạn yêu thích.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/80">
                Theo dõi creator, khám phá cộng đồng và chia sẻ những khoảnh khắc trực tiếp của bạn.
              </p>
            </div>
            <p className="text-sm text-white/60">Nội dung trực tiếp. Cộng đồng thật.</p>
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:justify-end">
              <Link
                to={PATHS.PUBLIC.HOME}
                className="flex items-center gap-2 text-sm font-bold lg:hidden"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  S
                </span>
                StreamingPlatform
              </Link>
              <p className="text-sm text-secondary">
                {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
                <Link
                  to={isRegister ? PATHS.PUBLIC.LOGIN : PATHS.PUBLIC.REGISTER}
                  className="font-semibold text-primary transition hover:text-primary/80"
                >
                  {isRegister ? "Đăng nhập" : "Đăng ký"}
                </Link>
              </p>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              StreamingPlatform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {isRegister ? "Tạo tài khoản mới" : "Chào mừng bạn trở lại"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary">
              {isRegister
                ? "Tạo tài khoản để bắt đầu hành trình của bạn."
                : "Đăng nhập để tiếp tục khám phá thế giới streaming."}
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              {isRegister && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-sm font-medium" htmlFor="displayName">
                    Tên hiển thị
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      className={inputClasses}
                      value={form.displayName}
                      onChange={updateField("displayName")}
                      maxLength={100}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium" htmlFor="username">
                    Username
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="nguyenvana"
                      className={inputClasses}
                      value={form.username}
                      onChange={updateField("username")}
                      maxLength={50}
                      required
                    />
                  </label>
                </div>
              )}

              <label className="block text-sm font-medium" htmlFor="email">
                Email
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClasses}
                  value={form.email}
                  onChange={updateField("email")}
                  maxLength={255}
                  required
                />
              </label>

              <label className="block text-sm font-medium" htmlFor="password">
                Mật khẩu
                <span className="relative block">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="Tối thiểu 8 ký tự"
                    className={`${inputClasses} pr-16`}
                    value={form.password}
                    onChange={updateField("password")}
                    minLength={isRegister ? 8 : undefined}
                    maxLength={100}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary hover:text-primary"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </span>
              </label>

              {isRegister && (
                <label className="block text-sm font-medium" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                  <span className="relative block">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      className={`${inputClasses} pr-16`}
                      value={form.confirmPassword}
                      onChange={updateField("confirmPassword")}
                      minLength={8}
                      maxLength={100}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-secondary hover:text-primary"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                    >
                      {showConfirmPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </span>
                </label>
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

            <p className="mt-8 text-center text-xs leading-5 text-secondary">
              Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng
              tôi.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
