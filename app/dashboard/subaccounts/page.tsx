"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { Subaccount } from "@/lib/models";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/shared/LoadingDialog";
import { SubaccountColumns } from "@/components/table/Column";
import SubaccountFormDialog from "@/components/SubaccountFormDialog";
import { PlusCircle, RefreshCcw, Rocket } from "lucide-react";
import DeleteSubaccountDialog from "@/components/DeleteSubaccountDialog";
import TransferSubaccountDialog from "@/components/TransferSubaccountDialog";
import instance from "@/lib/axios";
import { useBusinessContext } from "@/context/BusinessContext";
import { useLiveMode } from "@/context/LiveModeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Subaccounts = () => {
  const { isLive } = useLiveMode();
  const [loading, setLoading] = useState(true);
  const [subaccounts, setSubaccounts] = useState<Subaccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedSubaccount, setSelectedSubaccount] =
    useState<Subaccount | null>(null);
  // This should be dynamically fetched from the user's session
  const { businessId } = useBusinessContext();

  const fetchSubaccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `/subaccounts/merchant/${businessId}`
      );

      const result = response.data;
      const fetchedSubaccounts: Subaccount[] = result.data.data.map(
        (item: any) => ({
          id: item.id,
          accountNumber: item.accountNumber,
          accountName: item.accountName,
          currency: item.currency,
          balance: item.balance,
          merchantId: businessId,
          bankName: item.bank.name,
          bankId: item.bank.id,
        })
      );
      setSubaccounts(fetchedSubaccounts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLive) {
      fetchSubaccounts();
    }
  }, [isLive, businessId]);

  const handleActionClick = (action: string, subaccount: Subaccount) => {
    setSelectedSubaccount(subaccount);
    if (action === "edit") setEditDialogOpen(true);
    if (action === "delete") setDeleteDialogOpen(true);
    if (action === "transfer") setTransferDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchSubaccounts();
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setTransferDialogOpen(false);
    setSelectedSubaccount(null);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-center text-gray-600">{error}</p>
        <Button onClick={fetchSubaccounts} className="mt-4">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subaccounts</h1>
          <Button onClick={() => setAddDialogOpen(true)} disabled>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subaccount
          </Button>
        </div>
        <div className="rounded-lg  p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Subaccount Management</CardTitle>
              {/* <CardDescription>
                In Test Mode, you can simulate adding subaccounts, but actual
                transfers to banks and wallets are not possible.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <Alert className="border-primary border-l-4 text-primary">
                <Rocket className="h-4 w-4" />
                <AlertTitle>Test Mode Active</AlertTitle>
                <AlertDescription>
                  Subaccount management and transfers are only available in Live
                  Mode.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subaccounts</h1>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subaccount
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <DataTable
            columns={SubaccountColumns({ onActionClick: handleActionClick })}
            data={subaccounts}
            searchableColumns={[
              { id: "accountName", title: "Account Name" },
              { id: "accountNumber", title: "Account Number" },
              { id: "bankName", title: "Bank Name" },
            ]}
          />
        </div>
      </div>

      <LoadingDialog open={loading} message="Fetching subaccounts..." />
      <SubaccountFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleSuccess}
        merchantId={businessId}
      />
      {selectedSubaccount && (
        <>
          <SubaccountFormDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={handleSuccess}
            merchantId={businessId}
            subaccount={selectedSubaccount}
          />
          <DeleteSubaccountDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={handleSuccess}
            subaccount={selectedSubaccount}
          />
          <TransferSubaccountDialog
            open={transferDialogOpen}
            onOpenChange={setTransferDialogOpen}
            onSuccess={handleSuccess}
            subaccount={selectedSubaccount}
          />
        </>
      )}
    </>
  );
};

export default Subaccounts;
