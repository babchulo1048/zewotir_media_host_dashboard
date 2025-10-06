// hooks/useBusinesses.ts
import { useEffect, useState, useCallback } from "react";
import instance from "@/lib/axios";
import { Business } from "@/lib/models";

export function useBusinesses(merchantId: number) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // This prevents infinite re-renders when the function is used in the useEffect dependency array.
  const refetch = useCallback(() => {
    setLoading(true);
    instance
      .get(`/merchant-business/merchant/${merchantId}`)
      .then((res) => {
        setBusinesses(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch businesses", err);
        setBusinesses([]); // Clear businesses on error
      })
      .finally(() => setLoading(false));
  }, [merchantId]); // The function is recreated only if merchantId changes.

  useEffect(() => {
    // Call the refetch function on initial load and whenever merchantId changes.
    refetch();
  }, [merchantId, refetch]);

  return { businesses, loading, refetch };
}
