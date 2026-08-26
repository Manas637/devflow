import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AppLogo from "../common/AppLogo";
import OrganizationSwitcher from "@/features/organization/components/OrganizationSwitcher";

export default function AppSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="border-b px-2 py-4">
        <AppLogo
          className="w-full"
        />
        <OrganizationSwitcher />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-3">
        <SidebarNav />
      </SidebarContent>

      {/* User */}
      <SidebarFooter className="border-t p-2">
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}