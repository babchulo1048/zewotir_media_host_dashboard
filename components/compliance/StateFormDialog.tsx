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
import { State } from "@/lib/models";
import { toast } from "sonner";
import instance from "@/lib/axios";

interface StateFormDialogProps {
  children: React.ReactNode;
  state?: State;
  onSuccess: () => void;
}

export function StateFormDialog({
  children,
  state,
  onSuccess,
}: StateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateName, setStateName] = useState(state ? state.stateName : "");

  useEffect(() => {
    if (state) {
      setStateName(state.stateName);
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateName) {
      toast.error("State name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (state) {
        // Update existing state
        await instance.put(`/compliance/states/${state.stateId}`, {
          stateName,
        });
        toast.success("State updated successfully!");
      } else {
        // Create new state
        await instance.post("/compliance/states", {
          stateName,
        });
        toast.success("State added successfully!");
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save state:", error);
      toast.error("Failed to save state. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{state ? "Edit State" : "Add State"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="stateName">Name</Label>
            <Input
              id="stateName"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="e.g., Oromia"
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
                ? state
                  ? "Updating..."
                  : "Adding..."
                : state
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
