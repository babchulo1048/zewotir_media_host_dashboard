"use client";

import { useEffect, useState } from "react";
import { Microfinance } from "@/lib/models"; // Assuming Microfinance model is imported
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { MicrofinanceFormDialog } from "@/components/microfinance/MicrofinanceFormDialog"; // New component
import { MicrofinanceColumns } from "@/components/table/Column"; // New columns
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MicrofinancePage = () => {
  const [loading, setLoading] = useState(false);
  const [microfinances, setMicrofinances] = useState<Microfinance[]>([]);

  const fetchMicrofinances = async () => {
    setLoading(true);
    try {
      // API: /microfinance/all
      const response = await instance.get("/microfinances");
      setMicrofinances(response.data.data || response.data); // Adjust based on actual API response structure
    } catch (err) {
      console.error("Failed to fetch microfinances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMicrofinances();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Microfinance Institutions</h1>
          <MicrofinanceFormDialog onSuccess={fetchMicrofinances}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Microfinance
            </Button>
          </MicrofinanceFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={MicrofinanceColumns({ onSuccess: fetchMicrofinances })}
            data={microfinances}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default MicrofinancePage;
