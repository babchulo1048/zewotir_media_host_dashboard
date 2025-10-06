"use client";

import { useEffect, useState } from "react";
import { StaffSize } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { StaffSizeFormDialog } from "@/components/compliance/StaffSizeFormDialog";
import { StaffSizeColumns } from "@/components/table/ComplianceColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const StaffSizePage = () => {
  const [loading, setLoading] = useState(false);
  const [staffSizes, setStaffSizes] = useState<StaffSize[]>([]);

  const fetchStaffSizes = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/compliance/staffsizes");
      setStaffSizes(response.data.data);
    } catch (err) {
      console.error("Failed to fetch staff sizes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffSizes();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Staff Sizes</h1>
          <StaffSizeFormDialog onSuccess={fetchStaffSizes}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Staff Size
            </Button>
          </StaffSizeFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={StaffSizeColumns({ onSuccess: fetchStaffSizes })}
            data={staffSizes}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default StaffSizePage;
