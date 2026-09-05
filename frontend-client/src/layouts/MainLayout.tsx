import { Outlet } from "react-router";

import Header from "@/components/layout/Header";

export default function MainLayout() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Header />
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
