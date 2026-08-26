import {
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

import ThemeToggle from "@/components/common/ThemeToggle";

import useAuth from "@/features/auth/hooks/useAuth";
import useLogout from "@/features/auth/hooks/useLogout";

export default function DashboardTopbar() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const logoutMutation = useLogout();

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className="
        flex h-16 shrink-0 items-center
        border-b border-border/60
        bg-background
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* Sidebar trigger */}

      <SidebarTrigger
        className="-ml-2"
        aria-label="Toggle sidebar"
      />

      {/* Page title */}

      <div className="ml-3">
        <h1 className="text-sm font-medium text-muted-foreground">
          Overview
        </h1>
      </div>

      {/* Right side */}

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-3 px-2"
            >
              <div
                className="
                  flex size-8 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-primary/10
                  text-sm font-medium
                  text-primary
                "
              >
                {initials}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-32 truncate text-sm font-medium">
                  {user?.name ?? "User"}
                </p>

                <p className="max-w-40 truncate text-xs text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56"
          >
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
            >
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 size-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
              className="
                text-destructive
                focus:text-destructive
              "
            >
              <LogOut className="mr-2 size-4" />

              {logoutMutation.isPending
                ? "Signing out..."
                : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}