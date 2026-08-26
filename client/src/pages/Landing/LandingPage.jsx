import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  FolderKanban,
  Layers3,
  LockKeyhole,
  Mail,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import AppLogo from "@/components/common/AppLogo";
import ThemeToggle from "@/components/common/ThemeToggle";

const features = [
  {
    icon: Layers3,
    title: "Multi-Tenant Organizations",
    description:
      "Keep teams, projects, and resources isolated while managing everything from one platform.",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create and manage projects with dedicated membership, roles, and access controls.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Control access with Owner, Admin, Member, and Viewer roles across organizations and projects.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite team members, manage memberships, and collaborate within your organization.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description:
      "Protect accounts and resources with secure authentication and authorization workflows.",
  },
  {
    icon: Mail,
    title: "Email Workflows",
    description:
      "Handle verification, password resets, and organization invitations through background jobs.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your organization",
    description:
      "Set up your organization and establish a secure workspace for your team.",
  },
  {
    number: "02",
    title: "Create projects",
    description:
      "Organize your work into projects with dedicated access and membership controls.",
  },
  {
    number: "03",
    title: "Invite your team",
    description:
      "Bring your team members into your organization and assign appropriate roles.",
  },
  {
    number: "04",
    title: "Build together",
    description:
      "Manage projects and collaborate while keeping resources properly isolated.",
  },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Decorative glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
        {/* Browser header */}
        <div className="flex h-12 items-center justify-between border-b border-border px-3 sm:h-14 sm:px-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-muted sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted sm:h-3 sm:w-3" />
          </div>

          <div className="hidden h-7 w-32 rounded-lg bg-muted sm:block sm:h-8 sm:w-40" />

          <div className="h-7 w-7 rounded-lg bg-primary/10 sm:h-8 sm:w-8" />
        </div>

        {/* Dashboard */}
        <div className="flex min-h-[350px] bg-background sm:min-h-[450px]">

          {/* Sidebar */}
          <aside className="hidden w-36 shrink-0 border-r border-border bg-card p-3 sm:block sm:w-40 sm:p-4">
            {/* Workspace */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <div className="h-3.5 w-3.5 rounded bg-primary/50" />
              </div>

              <div className="min-w-0">
                <div className="h-2.5 w-16 rounded bg-foreground/15" />
                <div className="mt-1 h-2 w-10 rounded bg-muted" />
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1.5">
              <div className="flex h-8 items-center gap-2 rounded-lg bg-primary/10 px-2.5">
                <div className="h-3 w-3 rounded bg-primary/50" />
                <div className="h-2.5 w-12 rounded bg-primary/40" />
              </div>

              <div className="flex h-8 items-center gap-2 rounded-lg px-2.5">
                <div className="h-3 w-3 rounded bg-muted" />
                <div className="h-2.5 w-14 rounded bg-muted" />
              </div>

              <div className="flex h-8 items-center gap-2 rounded-lg px-2.5">
                <div className="h-3 w-3 rounded bg-muted" />
                <div className="h-2.5 w-12 rounded bg-muted" />
              </div>

              <div className="flex h-8 items-center gap-2 rounded-lg px-2.5">
                <div className="h-3 w-3 rounded bg-muted" />
                <div className="h-2.5 w-14 rounded bg-muted" />
              </div>
            </div>

            {/* Workspace section */}
            <div className="mt-7">
              <div className="mb-2 h-2 w-16 rounded bg-muted" />

              <div className="space-y-1.5">
                <div className="h-7 rounded-lg bg-muted/60" />
                <div className="h-7 rounded-lg bg-muted/60" />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 p-4 sm:p-6">

            {/* Top bar */}
            <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
              <div>
                <p className="mb-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  Overview
                </p>

                <h3 className="text-sm font-semibold tracking-tight sm:text-lg">
                  Good morning
                </h3>

                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
                  Here's what's happening in your workspace.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden h-8 rounded-lg border border-border bg-card px-3 sm:flex sm:items-center">
                  <span className="text-[9px] text-muted-foreground">
                    DevFlow Team
                  </span>
                </div>

                <div className="h-8 w-8 rounded-full bg-primary/15 ring-2 ring-background" />
              </div>
            </div>

            {/* Stats */}
            <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-3">
              {[
                ["12", "Projects"],
                ["24", "Members"],
                ["4", "Roles"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-3 sm:p-4"
                >
                  <div className="text-base font-bold tracking-tight sm:text-xl">
                    {value}
                  </div>

                  <div className="mt-0.5 text-[9px] text-muted-foreground sm:mt-1 sm:text-xs">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Projects + Activity */}
            <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">

              {/* Recent projects */}
              <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div>
                    <div className="text-[10px] font-semibold sm:text-xs">
                      Recent Projects
                    </div>

                    <div className="mt-0.5 text-[8px] text-muted-foreground sm:text-[9px]">
                      Active workspace projects
                    </div>
                  </div>

                  <div className="text-[8px] text-primary sm:text-[9px]">
                    View all
                  </div>
                </div>

                <div className="space-y-2.5">

                  {/* Project 1 */}
                  <div className="rounded-lg border border-border/80 p-2.5 sm:p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-[9px] font-medium sm:text-[10px]">
                          DevFlow Web
                        </div>

                        <div className="mt-1 text-[8px] text-muted-foreground sm:text-[9px]">
                          8 members
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[7px] font-medium text-primary sm:text-[8px]">
                        Active
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 rounded-full bg-primary/50" />
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="rounded-lg border border-border/80 p-2.5 sm:p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-[9px] font-medium sm:text-[10px]">
                          API Platform
                        </div>

                        <div className="mt-1 text-[8px] text-muted-foreground sm:text-[9px]">
                          5 members
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[7px] font-medium text-muted-foreground sm:text-[8px]">
                        In Progress
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-1/2 rounded-full bg-primary/30" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team activity */}
              <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div>
                    <div className="text-[10px] font-semibold sm:text-xs">
                      Team Activity
                    </div>

                    <div className="mt-0.5 text-[8px] text-muted-foreground sm:text-[9px]">
                      Recent updates
                    </div>
                  </div>

                  <div className="h-5 w-5 rounded-full bg-primary/10" />
                </div>

                <div className="space-y-3">

                  <div className="flex gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10" />

                    <div className="min-w-0">
                      <div className="text-[8px] leading-3 sm:text-[9px]">
                        New member joined
                      </div>

                      <div className="mt-0.5 text-[7px] text-muted-foreground sm:text-[8px]">
                        2 min ago
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-muted" />

                    <div className="min-w-0">
                      <div className="text-[8px] leading-3 sm:text-[9px]">
                        Project updated
                      </div>

                      <div className="mt-0.5 text-[7px] text-muted-foreground sm:text-[8px]">
                        18 min ago
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10" />

                    <div className="min-w-0">
                      <div className="text-[8px] leading-3 sm:text-[9px]">
                        Role permissions changed
                      </div>

                      <div className="mt-0.5 text-[7px] text-muted-foreground sm:text-[8px]">
                        1 hour ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Access / collaboration strip */}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <div className="h-2.5 w-2.5 rounded bg-primary/40" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-[8px] font-medium sm:text-[9px]">
                    Role-based access enabled
                  </div>

                  <div className="hidden text-[8px] text-muted-foreground sm:block">
                    Your workspace is protected
                  </div>
                </div>
              </div>

              <div className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[7px] font-medium text-primary sm:text-[8px]">
                Secure
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="shrink-0"
            aria-label="DevFlow home"
          >
            <AppLogo />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
            >
              Start
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                How it works
              </a>

              <div className="my-2 border-t border-border" />

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            {/* Hero content */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Built for modern teams
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Build better.
                <br />
                <span className="text-primary">Ship together.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                DevFlow gives teams a secure workspace to organize
                organizations, manage projects, collaborate with members,
                and control access from one place.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:opacity-90"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                >
                  Sign In
                </Link>
              </div>

              {/* Benefits */}
              <div className="mt-9 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Organization-based access
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Role-based permissions
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Secure authentication
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  Team collaboration
                </div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="w-full">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* ==================== FEATURES ==================== */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border/60"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Built around the way teams work
              </h2>

              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                The essential tools for managing organizations, projects,
                members, and permissions without unnecessary complexity.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group flex min-h-[230px] flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
                  >
                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-t border-border/60"
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
            {/* Left */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                How it works
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                From setup to collaboration in a few steps.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Create your workspace, organize your projects, invite your
                team, and keep access under control as your organization
                grows.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md sm:gap-5 sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {step.number}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-semibold sm:text-lg">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center text-primary-foreground sm:px-10 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to build with your team?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-primary-foreground/80 sm:text-base sm:leading-7">
                Create your DevFlow workspace and start managing your
                projects with your team today.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:opacity-90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link
            to="/"
            className="self-center lg:self-auto"
            aria-label="DevFlow home"
          >
            <AppLogo />
          </Link>

          <p className="order-3 text-center text-sm text-muted-foreground lg:order-2">
            © 2026 DevFlow. Built for teams.
          </p>

          <div className="order-2 flex items-center justify-center gap-5 text-sm text-muted-foreground lg:order-3">
            <Link
              to="/login"
              className="transition-colors hover:text-foreground"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="transition-colors hover:text-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}