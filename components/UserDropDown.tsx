import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  LucideIcon,
  Settings,
  Bell,
  User,
  Shield,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

interface MenuGroup {
  label: string;
  items: {
    label: string;
    value: string;
    icon: LucideIcon;
    onClick?: () => void;
  }[];
}

const UserDropDown = () => {
  const router = useRouter();
  const email = localStorage.getItem("email");

  const menuGroups: MenuGroup[] = [
    // {
    //   label: "Account",
    //   items: [
    //     { label: "Profile", value: "profile", icon: User },
    //     { label: "Account Settings", value: "account", icon: BadgeCheck },
    //     { label: "Security", value: "security", icon: Shield },
    //   ],
    // },
    // {
    //   label: "Preferences",
    //   items: [
    //     { label: "Settings", value: "settings", icon: Settings },
    //     { label: "Notifications", value: "notifications", icon: Bell },
    //   ],
    // },
    {
      label: "Session",
      items: [
        {
          label: "Log out",
          value: "logout",
          icon: LogOut,
          onClick: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("userId");
            localStorage.removeItem("roleId");
            localStorage.removeItem("role");
            localStorage.removeItem("name");
            router.replace("/auth/login");
          },
        },
      ],
    },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-primary text-primary-foreground rounded-full">
                  {email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[220px]">
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-full">
                    {email?.[0].toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {menuGroups.map((group, index) => (
              <React.Fragment key={group.label}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {group.items.map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={item.onClick}
                      className="cursor-pointer"
                    >
                      <item.icon className="mr-2 " />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserDropDown;
