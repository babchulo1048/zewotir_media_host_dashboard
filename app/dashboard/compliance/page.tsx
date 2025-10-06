"use client";

import { useEffect, useState } from "react";
import { ComplianceColumns } from "@/components/table/Column";
import { DataTable } from "@/components/table/DataTable";
import LoadingDialog from "@/components/shared/LoadingDialog";

// Placeholder for your axios instance
import instance from "@/lib/axios";
import { Compliance } from "@/lib/models";

const CompliancePage = () => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<Compliance[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchComplianceData = async () => {
      try {
        const response = await instance.get("/compliance");
        // We have to map the nested 'data' array to get the actual compliance objects
        setComplianceData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch compliance data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Compliance</h1>

        <div className="rounded-lg p-4">
          <DataTable columns={ComplianceColumns} data={complianceData} />
        </div>
      </div>

      <LoadingDialog open={loading} message="..." />
    </>
  );
};

export default CompliancePage;
