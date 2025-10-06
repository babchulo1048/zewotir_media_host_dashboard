"use client";

import { useEffect, useState, useCallback } from "react";
import { TransactionColumns } from "@/components/table/Column";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import axios from "axios";

// Define the transaction interface based on backend response
interface ApiTransaction {
  id: string;
  txRef: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionType: string;
  createdAt: string;
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

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Or wherever you store your JWT

      const response = await axios.get(
        "http://127.0.0.1:9090/api/transactions/all",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );

      const fetchedData: ApiTransaction[] = response.data.data || [];
      console.log("fetchedData", fetchedData);
      setTransactions(fetchedData);
    } catch (error: any) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="rounded-lg p-4">
          <DataTable columns={TransactionColumns} data={transactions} />
        </div>
      </div>

      <LoadingDialog open={loading} message="Loading transactions..." />
    </>
  );
};

export default Transactions;
