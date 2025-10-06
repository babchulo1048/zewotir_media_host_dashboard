"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffSize } from "@/lib/models";
import { toast } from "sonner";
import instance from "@/lib/axios";

interface StaffSizeFormDialogProps {
  children: React.ReactNode;
  staffSize?: StaffSize;
  onSuccess: () => void;
}

export function StaffSizeFormDialog({
  children,
  staffSize,
  onSuccess,
}: StaffSizeFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staffSizeName, setStaffSizeName] = useState(
    staffSize ? staffSize.staffSizeName : ""
  );

  useEffect(() => {
    if (staffSize) {
      setStaffSizeName(staffSize.staffSizeName);
    }
  }, [staffSize]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffSizeName) {
      toast.error("Staff size name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (staffSize) {
        // Update existing staff size
        await instance.put(`/compliance/staffsizes/${staffSize.staffSizeId}`, {
          staffSizeName,
        });
        toast.success("Staff size updated successfully!");
      } else {
        // Create new staff size
        await instance.post("/compliance/staffsizes", {
          staffSizeName,
        });
        toast.success("Staff size added successfully!");
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save staff size:", error);
      toast.error("Failed to save staff size. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {staffSize ? "Edit Staff Size" : "Add Staff Size"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="staffSizeName">Name</Label>
            <Input
              id="staffSizeName"
              value={staffSizeName}
              onChange={(e) => setStaffSizeName(e.target.value)}
              placeholder="e.g., 1-10 employees"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? staffSize
                  ? "Updating..."
                  : "Adding..."
                : staffSize
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
