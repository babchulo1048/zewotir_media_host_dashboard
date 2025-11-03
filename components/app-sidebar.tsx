"use client";

import * as React from "react";
import {
  LucideIcon,
  LayoutDashboard,
  Layers, // For Portfolio Assets
  BookOpen, // For Blog Articles
  Mail, // For Inquiries
  Download, // For Resume
} from "lucide-react";

import { TeamSwitcher } from "@/components/team-switcher";
import SideBarItems from "@/components/SideBarItems";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import UserDropDown from "./UserDropDown";
// Import the permissions hook
// import { usePermissions } from "@/hooks/CheckPermission";

// --- Interfaces ---
export interface SubMenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  permission?: string;
}
export interface MenuItem {
  title: string;
  url: string;
  submenu?: SubMenuItem[];
  icon?: LucideIcon;
  isActive?: boolean;
  permission?: string;
}

interface SidebarSection {
  label: string;
  items: MenuItem[];
}

// --- Sidebar Sections with Permissions ---
const sidebarSections: SidebarSection[] = [
  {
    label: "Main", // You might rename this to "Overview & Content"
    items: [
      {
        title: "Dashboard",
        url: "/dashboard", // Changed to /admin as per typical structure
        icon: LayoutDashboard, // 🏠
      },
      {
        title: "Portfolio Assets",
        url: "/dashboard/portfolio",
        icon: Layers, // ✨ Represents content tiers/layers
      },
      {
        title: "Blog Articles",
        url: "/dashboard/Blog",
        icon: BookOpen, // 📰 Represents reading/articles
      },
      {
        title: "Inquiries",
        url: "/dashboard/Inquiries",
        icon: Mail, // 📧 Represents email/communication
      },
      {
        title: "Resume",
        url: "/dashboard/Resume",
        icon: Download, // 📄 Represents file download/upload management
      },
    ],
  },
];
// --- AppSidebar Component with Filtering ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 1. Fetch permissions state and check function
  // const { isLoading, hasPermission } = usePermissions();

  // 2. Filter the sections based on permissions

  // 4. Render the sidebar with filtered items
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the filtered data to the rendering component */}
        <SideBarItems sections={sidebarSections} />
      </SidebarContent>
      <SidebarFooter>
        <UserDropDown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
