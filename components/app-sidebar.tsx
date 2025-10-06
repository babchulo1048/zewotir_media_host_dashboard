"use client";

import * as React from "react";
import {
  LucideIcon,
  Banknote,
  CreditCard,
  Settings2,
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

export interface SubMenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
}
export interface MenuItem {
  title: string;
  url: string;
  submenu?: SubMenuItem[];
  icon?: LucideIcon;
  isActive?: boolean;
}

interface MenuHeaderItem {
  name: string;
  logo: LucideIcon;
  plan: string;
}

// const teams: MenuHeaderItem[] = [
//   {
//     name: "Acme Inc",
//     logo: GalleryVerticalEnd,
//     plan: "Enterprise",
//   },
//   {
//     name: "Acme Corp.",
//     logo: AudioWaveform,
//     plan: "Startup",
//   },
//   {
//     name: "Evil Corp.",
//     logo: Command,
//     plan: "Free",
//   },
// ];

interface SidebarSection {
  label: string;
  items: MenuItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: CreditCard,
      },
      {
        title: "Microfinance",
        url: "/dashboard/microfinance",
        icon: ShieldCheck,
      },
      { title: "Roles Management", url: "/dashboard/roles", icon: UserCog },
      // { title: "Subaccounts", url: "/dashboard/subaccounts", icon: Banknote },
    ],
  },

  // {
  //   label: "Settings",
  //   items: [
  //     // { title: "Help Center", url: "/dashboard/help-center", icon: HelpCircle },
  //     // { title: "FAQ", url: "/dashboard/faq", icon: MessageSquare },
  //     { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
  //   ],
  // },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const merchantIdStr = localStorage.getItem("merchantId");
  const merchantId = merchantIdStr ? Number(merchantIdStr) : 0;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SideBarItems sections={sidebarSections} />
      </SidebarContent>
      <SidebarFooter>
        <UserDropDown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
