import { Link } from "react-router";

import { Button } from "@/components/ui/Button";
import { PATHS } from "@/routes/paths";

export default function HomePage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute -right-32 -top-40 -z-10 h-96 w-96 rounded-full bg-primary-light blur-3xl" />
      <div className="absolute -bottom-48 -left-20 -z-10 h-96 w-96 rounded-full bg-info-light/60 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100dvh-64px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Your live world
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.06em] sm:text-7xl">
            Find your next live room.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-secondary">
            Kết nối với những creator, cộng đồng và khoảnh khắc trực tiếp khiến bạn muốn quay lại
            mỗi ngày.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={PATHS.PUBLIC.REGISTER}>
              <Button>Tạo tài khoản</Button>
            </Link>
            <Link to={PATHS.PUBLIC.LOGIN}>
              <Button variant="ghost">Đăng nhập</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-border bg-accent p-4 shadow-2xl shadow-foreground/10">
          <div className="rounded-[1.5rem] bg-foreground p-6 text-primary-foreground sm:p-8">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
              <span>Live now</span>
              <span className="flex items-center gap-2 text-live-light">
                <span className="h-2 w-2 rounded-full bg-live" /> 2.8k viewers
              </span>
            </div>
            <div className="mt-16 flex aspect-video items-end rounded-2xl bg-gradient-to-br from-primary/80 via-primary/30 to-info/30 p-5">
              <div>
                <p className="text-xs font-semibold text-primary-foreground/70">
                  Late night stories
                </p>
                <p className="mt-1 text-2xl font-black">No script, just real conversations.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-primary-light" />
              <div>
                <p className="text-sm font-bold">Minh Anh Live</p>
                <p className="text-xs text-primary-foreground/60">Talk · Live room</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
