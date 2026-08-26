import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/dashboard/AppSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import useInitializeOrganization from "@/features/organization/hooks/useInitializeOrganization";

export default function DashboardLayout() {
  useInitializeOrganization();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <div className="flex h-svh min-h-0 flex-col">
          <DashboardTopbar />

          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}