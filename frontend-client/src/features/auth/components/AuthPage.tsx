import { AuthBrandPanel } from "./AuthBrandPanel";
import { AuthForm } from "./AuthForm";
import { AuthIntro } from "./AuthIntro";
import { AuthLegalNotice } from "./AuthLegalNotice";
import { AuthPageHeader } from "./AuthPageHeader";
import type { AuthMode } from "../types";

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,0.95fr)]">
        <AuthBrandPanel />
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <AuthPageHeader mode={mode} />
            <AuthIntro mode={mode} />
            <AuthForm mode={mode} />
            <AuthLegalNotice />
          </div>
        </section>
      </div>
    </main>
  );
}
