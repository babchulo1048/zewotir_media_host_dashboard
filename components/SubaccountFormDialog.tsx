// components/SubaccountFormDialog.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Subaccount } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingDialog from "@/components/shared/LoadingDialog";
import {
  Pencil,
  PlusCircle,
  Building,
  CreditCard,
  User,
  Banknote,
} from "lucide-react";
import instance from "@/lib/axios";
import { useBusinessContext } from "@/context/BusinessContext";

interface Bank {
  id: string;
  name: string;
}

interface SubaccountFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  subaccount?: Subaccount;
  merchantId?: string | null;
}

const SubaccountFormDialog = ({
  open,
  onOpenChange,
  onSuccess,
  subaccount,
  merchantId,
}: SubaccountFormDialogProps) => {
  const isEditing = !!subaccount;
  const { businessId } = useBusinessContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(true);

  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    currency: "",
    bankId: "",
  });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await instance.get("/banks");
        setBanks(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch banks:", err);
      } finally {
        setIsFetchingBanks(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    if (isEditing && subaccount) {
      setFormData({
        accountName: subaccount.accountName,
        accountNumber: subaccount.accountNumber,
        currency: subaccount.currency,
        bankId: subaccount.bankId,
      });
    } else {
      setFormData({
        accountName: "",
        accountNumber: "",
        currency: "ETB",
        bankId: banks.length > 0 ? banks[0].id : "",
      });
    }
  }, [isEditing, subaccount, open, banks]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.accountName ||
      !formData.accountNumber ||
      !formData.currency ||
      !formData.bankId
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const response = await instance.put(
          `/subaccounts/${subaccount?.id}`,
          formData
        );
        console.log("Updated subaccount successfully.", response.data);
      } else {
        const payload = {
          ...formData,
          businessId,
          reference: "InitialSetup",
        };
        const response = await instance.post("/subaccounts", payload);
        console.log("Added subaccount successfully.", response.data);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("API error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} subaccount`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Pencil className="h-5 w-5" /> Edit Subaccount
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" /> Add Subaccount
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of the subaccount."
                : "Create a new subaccount for the merchant."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="accountName" className="flex items-center gap-1">
                <User className="h-4 w-4" /> Account Name
              </Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="accountNumber"
                className="flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" /> Account Number
              </Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency" className="flex items-center gap-1">
                <Banknote className="h-4 w-4" /> Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETB">ETB</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bankId" className="flex items-center gap-1">
                <Building className="h-4 w-4" /> Bank
              </Label>
              <Select
                value={formData.bankId}
                onValueChange={(value) => handleSelectChange("bankId", value)}
                disabled={isFetchingBanks}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {isFetchingBanks ? (
                    <SelectItem disabled value="loading">
                      Loading banks...
                    </SelectItem>
                  ) : (
                    banks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditing ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <LoadingDialog
        open={loading}
        message={isEditing ? "Saving changes..." : "Creating subaccount..."}
      />
    </>
  );
};

export default SubaccountFormDialog;
