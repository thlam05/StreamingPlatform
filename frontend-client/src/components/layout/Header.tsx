import { Link, NavLink } from "react-router";

import { PATHS } from "@/routes/paths";

export default function Header() {
  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to={PATHS.PUBLIC.HOME} className="flex items-center gap-2 font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            S
          </span>
          StreamingPlatform
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <NavLink
            to={PATHS.PUBLIC.LOGIN}
            className="rounded-lg px-3 py-2 text-secondary transition hover:bg-primary-light hover:text-primary"
          >
            Đăng nhập
          </NavLink>
          <NavLink
            to={PATHS.PUBLIC.REGISTER}
            className="rounded-lg bg-primary px-3 py-2 text-primary-foreground transition hover:brightness-95"
          >
            Đăng ký
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
