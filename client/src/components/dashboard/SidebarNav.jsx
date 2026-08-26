import { Link, useLocation } from "react-router-dom";

import useCurrentOrganization from "@/features/organization/hooks/useCurrentOrganization";

import { dashboardNavigation } from "@/constants/dashboardNavigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export default function SidebarNav() {
  const { pathname } = useLocation();

  const {
    isMobile,
    setOpenMobile,
  } = useSidebar();

  const {
    organization,
    isLoading,
  } = useCurrentOrganization();

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // While organization state is being resolved,
  // don't render organization-dependent navigation.
  if (isLoading) {
    return null;
  }

  const organizationRole =
    organization?.role ?? null;

  const filteredNavigation =
    dashboardNavigation
      .map((group) => ({
        ...group,

        items: group.items.filter((item) => {
          /*
           * Workspace navigation:
           * Only show when the user belongs to an organization.
           *
           * Organization navigation:
           * Requires an organization and matching role.
           */
          if (group.label === "Workspace") {
            return item.to === "/dashboard"
              ? true
              : Boolean(organization);
          }

          if (group.label === "Organization") {
            if (!organizationRole) {
              return false;
            }

            return item.roles.includes(
              organizationRole
            );
          }

          return false;
        }),
      }))
      .filter(
        (group) =>
          group.items.length > 0
      );

  return (
    <>
      {filteredNavigation.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>
            {group.label}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => {
                const isActive =
                  item.to === "/organization"
                    ? pathname === item.to
                    : pathname === item.to ||
                      pathname.startsWith(
                        `${item.to}/`
                      );

                const Icon = item.icon;

                return (
                  <SidebarMenuItem
                    key={item.title}
                  >
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      asChild
                      className="
                        data-[active=true]:bg-primary/10
                        data-[active=true]:text-primary
                      "
                    >
                      <Link
                        to={item.to}
                        onClick={handleNavigation}
                      >
                        <Icon className="size-5" />

                        <span>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}