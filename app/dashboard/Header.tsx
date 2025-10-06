"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { LiveToggle } from "@/components/live-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";
// import EmployeeMenu from "@/components/dashboard/employees/EmployeeMenu";

const generateBreadcrumbs = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    return {
      href,
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      isLast,
    };
  });
};

interface HeaderProps {
  onRedirectToCompliance: () => void; // or specify arguments if any
}

const Header = ({ onRedirectToCompliance }: HeaderProps) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length <= 3) {
      return breadcrumbs.map((breadcrumb) => (
        <React.Fragment key={breadcrumb.href}>
          <BreadcrumbItem>
            {breadcrumb.isLast ? (
              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!breadcrumb.isLast && <BreadcrumbSeparator />}
        </React.Fragment>
      ));
    }

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {breadcrumbs.slice(1, -1).map((breadcrumb) => (
                <DropdownMenuItem key={breadcrumb.href}>
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {breadcrumbs[breadcrumbs.length - 1].label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  };

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/10 backdrop-blur-sm supports-[backdrop-filter]:bg-background/50">
      <header className="flex h-16 items-center justify-between px-4 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          {/* <LiveToggle onRedirect={onRedirectToCompliance} /> */}
          <ModeToggle />
        </div>
      </header>

      {/* <EmployeeMenu pathname={pathname} /> */}
    </div>
  );
};

export default Header;
