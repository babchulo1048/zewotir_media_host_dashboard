"use client";

import { useEffect, useState } from "react";
import { Industry } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { IndustryFormDialog } from "@/components/compliance/IndustryFormDialog";
import { IndustryColumns } from "@/components/table/ComplianceColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const IndustryTab = () => {
  const [loading, setLoading] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/compliance/industries");
      setIndustries(response.data.data);
    } catch (err) {
      console.error("Failed to fetch industries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Industries</h1>
          <IndustryFormDialog onSuccess={fetchIndustries}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Industry
            </Button>
          </IndustryFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={IndustryColumns({ onSuccess: fetchIndustries })}
            data={industries}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default IndustryTab;
