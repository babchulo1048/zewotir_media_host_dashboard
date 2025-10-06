"use client";

import { useEffect, useState } from "react";
import { State } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { StateFormDialog } from "@/components/compliance/StateFormDialog";
import { StateColumns } from "@/components/table/ComplianceColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const StateTab = () => {
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<State[]>([]);

  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/compliance/states");
      setStates(response.data.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">States</h1>
          <StateFormDialog onSuccess={fetchStates}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add State
            </Button>
          </StateFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={StateColumns({ onSuccess: fetchStates })}
            data={states}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default StateTab;
