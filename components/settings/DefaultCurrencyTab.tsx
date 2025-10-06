"use client";

import { useEffect, useState } from "react";
import { Currency } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { CurrencyFormDialog } from "@/components/compliance/CurrencyFormDialog";
import { CurrencyColumns } from "@/components/table/ComplianceColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DefaultCurrencyTab = () => {
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/currencies");
      setCurrencies(response.data.data);
    } catch (err) {
      console.error("Failed to fetch currencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Currencies</h1>
          <CurrencyFormDialog onSuccess={fetchCurrencies}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Currency
            </Button>
          </CurrencyFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={CurrencyColumns({ onSuccess: fetchCurrencies })}
            data={currencies}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default DefaultCurrencyTab;
