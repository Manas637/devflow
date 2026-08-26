import { useSelector } from "react-redux";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ROLE_LABELS } from "@/features/user/constants/roleLabels";

import { selectUser } from "@/store/auth";

import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";

export default function SidebarUser() {
  const user = useSelector(selectUser);

  const {
    organization,
  } = useCurrentOrganization();

  if (!user) {
    return null;
  }

  const initials =
    user.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const role = organization?.role;

  const roleLabel = role
    ? ROLE_LABELS[role] ?? role
    : "No organization";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip={user.name}
          className="h-auto py-2"
        >
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {roleLabel}
            </p>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}