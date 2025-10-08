"use client";

import { useEffect, useState, useCallback } from "react";
import { TransactionColumns } from "@/components/table/Column";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import axios from "axios";
// Assuming Button component exists and uses 'primary' styling by default
import { Button } from "@/components/ui/button";

// Define the transaction interface based on backend response
interface ApiTransaction {
  id: string;
  txRef: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionType: string;
  createdAt: string;
  updatedAt?: string; // Added from your new payload
  microfinance?: {
    id: number;
    name: string;
    phoneNumber?: string;
    email?: string;
    logoUrl?: string;
    merchantId?: string;
  };
  metadata?: Record<string, any> | null;
}

// Define the expected API response structure
interface ApiResponse {
  message: string;
  status: string;
  data: ApiTransaction[];
}

// Define the base API URLs
const ADMIN_API_URL = "http://127.0.0.1:9090/api/v1/transactions/all";
const MICROFINANCE_API_URL_BASE =
  "http://127.0.0.1:9090/api/v1/transactions/microfinance";

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);

  // Retrieve user data once
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const handleExport = () => {
    // For time being, nothing happens
    console.log("Export button clicked (No action defined yet)");
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);

    if (!role || !userId) {
      console.error("User role or ID is missing. Cannot fetch transactions.");
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

      const response = await axios.get<ApiResponse>(apiEndpoint, {
        // Use the defined response interface
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });

      // Extract the transactions array from the 'data' field of the API response
      const fetchedData: ApiTransaction[] = response.data.data || [];
      console.log(
        `Transactions fetched for ${role} from ${apiEndpoint}`,
        fetchedData
      );

      setTransactions(fetchedData);
    } catch (error: any) {
      console.error(`Failed to fetch transactions from ${apiEndpoint}:`, error);
      // Display a relevant error if needed, but set transactions to empty array to clear previous state
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [role, userId]); // Dependency array includes role and userId

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* START: Header with Export Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            // Using default/primary background as requested ("primary backgoriund")
            // Assuming default Button variant uses primary color
          >
            Export
          </Button>
        </div>
        {/* END: Header with Export Button */}

        <div className="rounded-lg p-4">
          <DataTable columns={TransactionColumns} data={transactions} />
        </div>
      </div>

      <LoadingDialog open={loading} message="Loading transactions..." />
    </>
  );
};

export default Transactions;
