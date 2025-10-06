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
import { Industry } from "@/lib/models";
import { toast } from "sonner";
import instance from "@/lib/axios";

interface IndustryFormDialogProps {
  children: React.ReactNode;
  industry?: Industry;
  onSuccess: () => void;
}

export function IndustryFormDialog({
  children,
  industry,
  onSuccess,
}: IndustryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [industryName, setIndustryName] = useState(
    industry ? industry.industryName : ""
  );

  useEffect(() => {
    if (industry) {
      setIndustryName(industry.industryName);
    }
  }, [industry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryName) {
      toast.error("Industry name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (industry) {
        // Update existing industry
        await instance.put(`/compliance/industries/${industry.industryId}`, {
          industryName,
        });
        toast.success("Industry updated successfully!");
      } else {
        // Create new industry
        await instance.post("/compliance/industries", {
          industryName,
        });
        toast.success("Industry added successfully!");
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save industry:", error);
      toast.error("Failed to save industry. Please try again.");
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
            {industry ? "Edit Industry" : "Add Industry"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="industryName">Name</Label>
            <Input
              id="industryName"
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              placeholder="e.g., Financial Services"
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
                ? industry
                  ? "Updating..."
                  : "Adding..."
                : industry
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
