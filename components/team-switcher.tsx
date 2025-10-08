"use client";

import * as React from "react";
import axios from "axios"; // Import axios for HTTP requests
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define the shape of the data we want to display
interface MicrofinanceData {
  name: string;
  logoUrl: string | null;
}

// Base URL for the image uploads, assuming your Spring Boot runs on 9090

export function TeamSwitcher() {
  const [microfinance, setMicrofinance] =
    React.useState<MicrofinanceData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 1. Get role and ID from localStorage
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    console.log("userId:", userId);

    // Check if the user is a microfinance user and has a userId
    if (role === "ROLE_MICROFINANCE" && userId) {
      const fetchMicrofinanceData = async () => {
        try {
          // Construct the dynamic API URL using the stored userId
          const apiUrl = `http://127.0.0.1:9090/api/v1/microfinances/${userId}`;

          // Assuming you have a way to include the JWT token for authorization
          const token = localStorage.getItem("token");

          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = response.data.data;
          console.log("data:", data);

          setMicrofinance({
            name: data.name,
            logoUrl: data.logo,
          });
        } catch (err) {
          console.error("Failed to fetch microfinance data:", err);
          setError("Failed to load company data.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchMicrofinanceData();
    } else {
      // If not ROLE_MICROFINANCE or no userId, use static/default admin text
      setIsLoading(false);
    }
  }, []);

  // Set default values if loading or if not a microfinance role
  const displayName = microfinance?.name || "Admin";
  const displayTitle = microfinance ? "Dashboard" : "Admin Dashboard";
  const initials = displayName.charAt(0).toUpperCase();

  // If loading, show a basic state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-400 animate-pulse">
              {/* Loading spinner or placeholder */}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-gray-400">
                Loading...
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // --- Rendering the Dynamic Component ---
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* Logo or Initial Fallback */}
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
            {microfinance?.logoUrl ? (
              // If logoUrl exists, construct the full image URL and display the image
              <img
                src={`${microfinance.logoUrl}`} // Assuming logoUrl is a full URL; adjust if it's a relative path
                alt={`${displayName} logo`}
                className="size-full rounded-lg object-cover"
              />
            ) : (
              // Fallback to the initial letter if no logo is available
              <span className="font-bold">{initials}</span>
            )}
          </div>

          {/* Name and Role/Title */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{displayName}</span>
            <span className="truncate text-xs">{displayTitle}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
