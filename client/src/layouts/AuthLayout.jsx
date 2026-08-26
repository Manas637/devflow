import { Outlet } from "react-router-dom";

import AppLogo from "@/components/common/AppLogo";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 auth-background"
      />
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <AppLogo />

          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 justify-center pt-24">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}