"use client";

import { useEffect, useState } from "react";
import { SubCity } from "@/lib/models";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";
import instance from "@/lib/axios";
import { SubCityFormDialog } from "@/components/compliance/SubCityFormDialog";
import { SubCityColumns } from "@/components/table/ComplianceColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SubCityTab = () => {
  const [loading, setLoading] = useState(false);
  const [subCities, setSubCities] = useState<SubCity[]>([]);

  const fetchSubCities = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/compliance/sub-city");
      setSubCities(response.data.data);
    } catch (err) {
      console.error("Failed to fetch sub-cities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCities();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sub-cities</h1>
          <SubCityFormDialog onSuccess={fetchSubCities}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Sub-city
            </Button>
          </SubCityFormDialog>
        </div>

        <div className="rounded-lg p-4">
          <DataTable
            columns={SubCityColumns({ onSuccess: fetchSubCities })}
            data={subCities}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default SubCityTab;
