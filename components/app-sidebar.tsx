"use client";

import * as React from "react";
import {
  LucideIcon,
  CreditCard,
  UserCog,
  LayoutDashboard,
  ShieldCheck,
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
import { usePermissions } from "@/hooks/CheckPermission";

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
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        permission: "VIEW_DASHBOARD",
      },
      {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: CreditCard,
        permission: "VIEW_TRANSACTIONS",
      },
      {
        title: "Finance Institutions",
        url: "/dashboard/microfinance",
        icon: ShieldCheck,
        permission: "VIEW_MICROFINANCE",
      },
      {
        title: "Customers",
        url: "/dashboard/customer",
        icon: ShieldCheck,
        permission: "VIEW_USER",
      },
      {
        title: "Roles Management",
        url: "/dashboard/roles",
        icon: UserCog,
        permission: "MANAGE_ROLES",
      },
    ],
  },
];

// --- AppSidebar Component with Filtering ---
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 1. Fetch permissions state and check function
  const { isLoading, hasPermission } = usePermissions();

  // 2. Filter the sections based on permissions
  const filteredSections = React.useMemo(() => {
    if (isLoading) return []; // Return empty array while loading

    return (
      sidebarSections
        .map((section) => ({
          ...section,
          // Keep items only if permission is null/undefined OR hasPermission returns true
          items: section.items.filter(
            (item) => !item.permission || hasPermission(item.permission)
          ),
        }))
        // Remove sections that contain no visible items after filtering
        .filter((section) => section.items.length > 0)
    );
  }, [isLoading, hasPermission]); // Recalculate only when loading status or permissions change

  // 3. Handle loading state
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          {/* You can replace this with a proper Skeleton or CircularProgress */}
          <div className="p-4 text-center text-sm text-gray-500">
            Loading menu...
          </div>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  // 4. Render the sidebar with filtered items
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the filtered data to the rendering component */}
        <SideBarItems sections={filteredSections} />
      </SidebarContent>
      <SidebarFooter>
        <UserDropDown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
