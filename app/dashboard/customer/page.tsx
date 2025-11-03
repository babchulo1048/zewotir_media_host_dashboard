"use client";

import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import { CustomerColumns } from "@/components/table/Column";
import LoadingDialog from "@/components/shared/LoadingDialog"; // Assuming you have this component
import axios from "axios";

// Define the Customer interface based on your API payload (simplified to match provided keys)
interface ApiCustomer {
  id: number;
  clientId: string;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // Note: The 'role' field from your old 'Customer' model is NOT in the API,
  // so we will need to ensure the UI columns can handle the data we receive.
}

// Define the base API URLs
const ADMIN_API_URL = "http://localhost:9090/api/v1/customers/all";
const MICROFINANCE_API_URL_BASE =
  "http://localhost:9090/api/v1/customers/microfinance";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve user data once
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
  }, []);

  // Function to simulate refreshing or re-fetching customers (used after an action)
  const refreshCustomers = useCallback(() => {
    // Simply trigger a refetch
    fetchCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!role || (role === "ROLE_MICROFINANCE" && !userId)) {
      setError("User role or ID is missing. Cannot fetch customers.");
      setLoading(false);
      return;
    }

    // --- DYNAMIC URL SELECTION LOGIC ---
    let apiEndpoint = ADMIN_API_URL;
    if (role === "ROLE_MICROFINANCE") {
      // Construct the microfinance-specific endpoint
      apiEndpoint = `${MICROFINANCE_API_URL_BASE}/${userId}`;
    }
    // ------------------------------------

    try {
      const token = localStorage.getItem("token");

      // The API returns an array directly, so we don't need a wrapper interface for the response body
      const response = await axios.get<ApiCustomer[]>(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      // The API response is the array of customers directly
      const fetchedData: ApiCustomer[] = response.data || [];

      // NOTE: If your DataTable/CustomerColumns rely on the 'role' field from the old 'Customer' model,
      // you may need to map or augment the data here. For now, we assume the UI can handle the new keys.

      setCustomers(fetchedData);
    } catch (e: any) {
      console.error(`Failed to fetch customers from ${apiEndpoint}:`, e);
      let errorMessage = "Failed to fetch customer data.";
      if (axios.isAxiosError(e) && e.response) {
        errorMessage = `Failed to fetch customer data. Status: ${e.response.status}`;
      }
      setError(errorMessage);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[60vh] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customers</h1>
          {/* <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button> */}
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            // Ensure CustomerColumns can handle the ApiCustomer structure
            columns={CustomerColumns({ onSuccess: refreshCustomers })}
            data={customers}
          />
        </div>
      </div>

      {/* Assuming LoadingDialog is available */}
      <LoadingDialog open={loading} message="Loading customers..." />
    </>
  );
};

export default CustomerPage;
