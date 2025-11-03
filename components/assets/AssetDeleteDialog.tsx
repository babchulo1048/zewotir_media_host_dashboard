"use client";

import React, { useState } from "react";
import { PortfolioAsset } from "@/lib/models"; // Allichasqa: Alias path
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Allichasqa: Alias path
import { Button } from "@/components/ui/button"; // Allichasqa: Alias path
import { useToast } from "@/components/ui/use-toast"; // Allichasqa: Alias path
import { apiFetch } from "@/lib/axios"; // Allichasqa: Alias path
import { Trash2, Loader2 } from "lucide-react"; // 🌟 ADDED: Loader2 icon

interface AssetDeleteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  assetToDelete?: PortfolioAsset;
  onSuccess: () => void;
}

export const AssetDeleteDialog: React.FC<AssetDeleteDialogProps> = ({
  open,
  setOpen,
  assetToDelete,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle the actual API call for soft deletion
  const handleDelete = async () => {
    if (!assetToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      // 🎯 API Call: DELETE method to your backend endpoint
      await apiFetch(`/portfolio/assets/${assetToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      toast({
        title: "Success",
        description: `Asset "${assetToDelete.title}" marked as inactive.`,
      });
      onSuccess(); // Trigger re-fetch in the parent component
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: `Could not delete asset: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOpen(false); // Close dialog regardless of success/fail
    }
  };

  if (!assetToDelete) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-5 w-5" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will **soft-delete** the asset: **{assetToDelete.title}
            ** (ID: {assetToDelete.id}). It will be marked as **Inactive
            (Draft)** and hidden from the public portfolio. You can reactivate
            it later via the edit dialog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* 🌟 DISABLED: Cancel button disabled while deleting */}
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {/* 🌟 QHawaNA RIKUCHIY: Puyuwan qhawana */}
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Mark as Inactive"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
