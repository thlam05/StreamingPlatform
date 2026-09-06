import { Link } from "react-router";

import { PATHS } from "@/routes/paths";

export function AuthBrandPanel() {
  return (
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
  );
}
