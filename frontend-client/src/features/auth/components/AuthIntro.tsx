import type { AuthMode } from "../types";

interface AuthIntroProps {
  mode: AuthMode;
}

export function AuthIntro({ mode }: AuthIntroProps) {
  const isRegister = mode === "register";

  return (
    <>
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
    </>
  );
}
