import { Link } from "react-router";

import { PATHS } from "@/routes/paths";

import type { AuthMode } from "../types";

interface AuthPageHeaderProps {
  mode: AuthMode;
}

export function AuthPageHeader({ mode }: AuthPageHeaderProps) {
  const isRegister = mode === "register";

  return (
    <div className="mb-10 flex items-center justify-between lg:justify-end">
      <Link to={PATHS.PUBLIC.HOME} className="flex items-center gap-2 text-sm font-bold lg:hidden">
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
  );
}
