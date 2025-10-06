import React from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
// import { MenuItem } from "@/app/dashboard/SideBar";
import { usePathname } from "next/navigation";

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

interface SidebarSection {
  label: string;
  items: MenuItem[];
}

interface Props {
  sections: SidebarSection[];
}
const SideBarItems = ({ sections }: Props) => {
  const pathname = usePathname();

  const isActiveLink = (url: string) => pathname === url;

  const isActiveParent = (item: MenuItem) => {
    if (item.submenu) {
      return (
        item.submenu.some((subItem) => isActiveLink(subItem.url)) ||
        isActiveLink(item.url)
      );
    }
    return isActiveLink(item.url);
  };

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => (
              <React.Fragment key={item.title}>
                {item.submenu?.length ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={
                            isActiveParent(item) ? "bg-muted text-primary" : ""
                          }
                          tooltip={item.title}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                className={
                                  isActiveLink(subItem.url)
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : ""
                                }
                                asChild
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={
                        isActiveLink(item.url) ? "bg-muted text-primary" : ""
                      }
                      tooltip={item.title}
                      asChild
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};

export default SideBarItems;
