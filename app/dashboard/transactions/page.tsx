"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { TransactionColumns } from "@/components/table/Column";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/models";

interface ApiTransaction {
  id: string;
  txRef: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionType: string;
  createdAt: string;
  updatedAt?: string;
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

interface ApiResponse {
  message: string;
  status: string;
  data: ApiTransaction[];
}

const ADMIN_API_URL = "http://127.0.0.1:9090/api/v1/transactions/all";
const MICROFINANCE_API_URL_BASE =
  "http://127.0.0.1:9090/api/v1/transactions/microfinance";

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!role || !userId) return;

    setLoading(true);

    let apiEndpoint = ADMIN_API_URL;
    if (role === "ROLE_MICROFINANCE") {
      apiEndpoint = `${MICROFINANCE_API_URL_BASE}/${userId}`;
    }

    try {
      const response = await axios.get<ApiResponse>(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.data || []);
    } catch (error) {
      console.error(`Failed to fetch transactions from ${apiEndpoint}:`, error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [role, userId, token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const mappedTransactions: any = useMemo(
    () =>
      transactions.map((tx) => ({
        id: tx.id,
        tx_ref: tx.txRef,
        amount: tx.amount,
        payment_method: tx.paymentMethod,
        status: tx.status,
        transaction_type: tx.transactionType,
        created_at: tx.createdAt,
        updated_at: tx.updatedAt || "",
        phone_number: tx.microfinance?.phoneNumber || "",
        retry_count: "0", // string now
        timeout_express: "0", // string now
        microfinance: tx.microfinance || null,
        metadata: tx.metadata || null,
        business_id: tx.microfinance?.id?.toString() || "",
        business_phone: tx.microfinance?.phoneNumber || "",
      })),
    [transactions]
  );

  const handleExport = () => {
    console.log("Export button clicked (no action yet)");
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button onClick={handleExport}>Export</Button>
        </div>

        <div className="rounded-lg p-4">
          <DataTable columns={TransactionColumns} data={mappedTransactions} />
        </div>
      </div>

      <LoadingDialog open={loading} message="Loading transactions..." />
    </>
  );
};

export default Transactions;
