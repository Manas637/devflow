import {
  Activity,
  ArrowUpRight,
  Box,
  Code2,
  FolderKanban,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Projects",
    value: "0",
    icon: FolderKanban,
  },
  {
    label: "APIs",
    value: "0",
    icon: Code2,
  },
  {
    label: "Environments",
    value: "0",
    icon: Box,
  },
  {
    label: "Requests",
    value: "0",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your projects, APIs, and development
            environments from one place.
          </p>
        </div>

        <Button>
          Create Project
          <ArrowUpRight className="ml-2 size-4" />
        </Button>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Recent activity */}
        <div className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="font-semibold">
              Recent activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest workspace activity will appear here.
            </p>
          </div>

          <div className="flex min-h-56 items-center justify-center px-5 py-10">
            <div className="text-center">
              <Activity className="mx-auto size-8 text-muted-foreground/50" />

              <p className="mt-3 text-sm font-medium">
                No activity yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Start by creating your first project.
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="font-semibold">
              Quick actions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Get started with DevFlow.
            </p>
          </div>

          <div className="space-y-2 p-3">
            <Button
              variant="ghost"
              className="h-auto w-full justify-start px-3 py-3"
            >
              <FolderKanban className="mr-3 size-4 text-muted-foreground" />

              <div className="text-left">
                <p className="text-sm font-medium">
                  Create project
                </p>

                <p className="text-xs text-muted-foreground">
                  Start a new workspace project
                </p>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="h-auto w-full justify-start px-3 py-3"
            >
              <Code2 className="mr-3 size-4 text-muted-foreground" />

              <div className="text-left">
                <p className="text-sm font-medium">
                  Add API
                </p>

                <p className="text-xs text-muted-foreground">
                  Connect an API to your project
                </p>
              </div>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}