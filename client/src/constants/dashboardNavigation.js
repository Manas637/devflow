import {
  Activity,
  Box,
  Code2,
  FolderKanban,
  LayoutDashboard,
  Mail,
  Settings2,
  Users,
} from "lucide-react";

export const dashboardNavigation = [
  {
    label: "Workspace",

    items: [
      {
        title: "Dashboard",
        to: "/dashboard",
        icon: LayoutDashboard,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "Projects",
        to: "/projects",
        icon: FolderKanban,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "APIs",
        to: "/apis",
        icon: Code2,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "Environments",
        to: "/environments",
        icon: Box,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "Activity",
        to: "/activity",
        icon: Activity,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },
    ],
  },

  {
    label: "Organization",

    items: [
      {
        title: "Overview",
        to: "/organization",
        icon: Settings2,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "Members",
        to: "/organization/members",
        icon: Users,
        roles: ["OWNER", "ADMIN", "MEMBER"],
      },

      {
        title: "Invitations",
        to: "/organization/invitations",
        icon: Mail,
        roles: ["OWNER", "ADMIN"],
      },
    ],
  },
];