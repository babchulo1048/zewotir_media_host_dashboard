// components/DeleteSubaccountDialog.tsx
"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Subaccount } from "@/lib/models";
import LoadingDialog from "@/components/shared/LoadingDialog";
import { Trash2 } from "lucide-react";

interface DeleteSubaccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subaccount: Subaccount;
  onSuccess: () => void;
}

const DeleteSubaccountDialog = ({
  open,
  onOpenChange,
  subaccount,
  onSuccess,
}: DeleteSubaccountDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: Replace with your actual API call to delete the subaccount
      // const response = await fetch(`/api/subaccounts/${subaccount.id}`, {
      //   method: "DELETE",
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to delete subaccount");
      // }
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Subaccount with ID ${subaccount.id} deleted successfully.`);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subaccount: **{subaccount.accountName}** (Account Number:{" "}
              {subaccount.accountNumber}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} asChild>
              <Button variant="destructive" disabled={loading}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LoadingDialog open={loading} message="Deleting subaccount..." />
    </>
  );
};

export default DeleteSubaccountDialog;
