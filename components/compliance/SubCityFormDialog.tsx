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
import { State, SubCity } from "@/lib/models";
import { toast } from "sonner";
import instance from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingDialog from "@/components/shared/LoadingDialog";

interface SubCityFormDialogProps {
  children: React.ReactNode;
  subCity?: SubCity;
  onSuccess: () => void;
}

export function SubCityFormDialog({
  children,
  subCity,
  onSuccess,
}: SubCityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStates, setLoadingStates] = useState(true);
  const [states, setStates] = useState<State[]>([]);
  const [subCityName, setSubCityName] = useState(
    subCity ? subCity.subCityName : ""
  );
  const [stateId, setStateId] = useState<string | undefined>(
    subCity?.state?.stateId || undefined
  );

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const response = await instance.get("/compliance/states");
      setStates(response.data.data);
    } catch (err) {
      console.error("Failed to fetch states:", err);
      toast.error("Failed to load states. Please try again.");
    } finally {
      setLoadingStates(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStates();
    }
    if (subCity) {
      setSubCityName(subCity.subCityName);
      setStateId(subCity.state?.stateId);
    }
  }, [subCity, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCityName || !stateId) {
      toast.error("Sub-city name and state are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (subCity) {
        // Update existing sub-city
        await instance.put(`/compliance/sub-city/${subCity.subCityId}`, {
          subCityName,
          stateId,
        });
        toast.success("Sub-city updated successfully!");
      } else {
        // Create new sub-city
        await instance.post("/compliance/sub-city", {
          subCityName,
          stateId,
        });
        toast.success("Sub-city added successfully!");
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save sub-city:", error);
      toast.error("Failed to save sub-city. Please try again.");
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
            {subCity ? "Edit Sub-city" : "Add Sub-city"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="subCityName">Name</Label>
            <Input
              id="subCityName"
              value={subCityName}
              onChange={(e) => setSubCityName(e.target.value)}
              placeholder="e.g., Ferensay Legasion"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            {loadingStates ? (
              <div className="text-center">Loading states...</div>
            ) : (
              <Select value={stateId} onValueChange={setStateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s.stateId} value={s.stateId}>
                      {s.stateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingStates}>
              {isSubmitting
                ? subCity
                  ? "Updating..."
                  : "Adding..."
                : subCity
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
