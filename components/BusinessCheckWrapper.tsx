// components/BusinessCheckWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useBusinesses } from "@/hooks/useBusinesses";
import { AddBusinessDialog } from "./AddBusinessDialog";
import { useBusinessContext } from "@/context/BusinessContext";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname

interface BusinessCheckWrapperProps {
  children: React.ReactNode;
}

export function BusinessCheckWrapper({ children }: BusinessCheckWrapperProps) {
  const merchantIdStr = localStorage.getItem("merchantId");
  const merchantId = merchantIdStr ? Number(merchantIdStr) : 0;
  const { businesses, loading, refetch } = useBusinesses(merchantId);
  const { businessId, setBusinessId } = useBusinessContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    // Only proceed if loading is complete
    if (!loading) {
      if (businesses.length === 0) {
        setIsDialogOpen(true);
      } else {
        setIsDialogOpen(false);
        // Ensure a business is selected if one exists
        if (!businessId) {
          setBusinessId(String(businesses[0].businessId));
        }
      }
    }
  }, [businesses, loading, businessId, setBusinessId, pathname]); // Add pathname as a dependency

  const handleSuccess = () => {
    refetch();
    setIsDialogOpen(false);
    // After adding a business, redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <>
      {children}
      {isDialogOpen && (
        <AddBusinessDialog
          merchantId={merchantId}
          onSuccess={handleSuccess}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
