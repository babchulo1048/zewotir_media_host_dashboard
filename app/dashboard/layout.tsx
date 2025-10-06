"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import { AppSidebar } from "@/components/app-sidebar";
import instance from "@/lib/axios";
import { BusinessCheckWrapper } from "@/components/BusinessCheckWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeContent, setActiveContent] = useState("children");

  const handleRedirectToCompliance = () => {
    // Navigate to the settings page with a URL parameter to specify the tab
    router.push("/dashboard/settings?tab=compliance");
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      try {
        await instance.get("/auth/verify/expiredToken");
        setIsCheckingAuth(false);
      } catch (error: any) {
        if (error.response?.status === 403) {
          console.warn("Token expired, redirecting.");
        } else {
          console.error("Token validation failed:", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        router.replace("/auth/login");
      }
    };

    checkToken();
  }, [pathname, router]); // 🔁 run every time route changes

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="relative flex min-h-screen w-full">
      {/* <BusinessCheckWrapper> */}
      <AppSidebar />
      <div className="flex-1 flex  flex-col min-w-0 ">
        <Header onRedirectToCompliance={handleRedirectToCompliance} />
        <main className="relative flex-1   overflow-auto p-4">{children}</main>
      </div>
      {/* </BusinessCheckWrapper> */}
    </div>
  );
}
