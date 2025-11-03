"use client";

import React from "react";
// Allichasqa: Chay import path-kunata '@/' alias-man kutichisqa chaynapi allichayta atinanpaq.
import { PortfolioAsset, AssetType } from "@/lib/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/axios";
import LoadingDialog from "../shared/LoadingDialog";
import { Loader2 } from "lucide-react"; // Loader icon

interface AssetFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  assetToEdit?: PortfolioAsset;
  onSuccess: () => void;
}

export const AssetFormDialog: React.FC<AssetFormDialogProps> = ({
  open,
  setOpen,
  assetToEdit,
  onSuccess,
}) => {
  const isEditMode = !!assetToEdit;
  const { toast } = useToast();

  // State for tracking submission loading
  const [isLoading, setIsLoading] = React.useState(false);

  const title = isEditMode
    ? `Edit Asset: ${assetToEdit.title}`
    : "Create New Portfolio Asset";
  const buttonText = isEditMode ? "Save Changes" : "Create Asset";

  // --- Initial Form State Setup ---
  // 🌟 ALLICHASQA: Duplicate key warning-kunata allichasqa huk kutillapi willañiqikunata churaspa.
  const baseAsset: Partial<PortfolioAsset> = assetToEdit || {};

  const defaultAsset: Partial<PortfolioAsset> = {
    title: baseAsset.title || "",
    description: baseAsset.description || "",
    url: (baseAsset as any)?.link_url || baseAsset.url || "",
    thumbnailUrl:
      (baseAsset as any)?.thumbnail_url || baseAsset.thumbnailUrl || "",
    assetType: (
      (baseAsset.assetType as string) || "media"
    ).toLowerCase() as AssetType,
    isFeatured: baseAsset.isFeatured || false,
    isActive: baseAsset.isActive || true,
  };

  // State hooks for form controls
  const [selectedAssetType, setSelectedAssetType] = React.useState<AssetType>(
    defaultAsset.assetType as AssetType
  );
  // HIDDEN SWITCHES: These states remain to preserve the data upon submission.
  const [isFeatured, setIsFeatured] = React.useState(
    defaultAsset.isFeatured || false
  );
  const [isActive, setIsActive] = React.useState(defaultAsset.isActive || true);

  React.useEffect(() => {
    if (assetToEdit) {
      // Ensure we set the state with the lowercase value
      setSelectedAssetType(
        (assetToEdit.assetType || "media").toLowerCase() as AssetType
      );
      setIsFeatured(assetToEdit.isFeatured || false);
      setIsActive(assetToEdit.isActive || true);
    } else {
      // Use the correct lowercase default
      setSelectedAssetType("media" as AssetType);
      setIsFeatured(false);
      setIsActive(true);
    }
  }, [assetToEdit, open]);

  // Conditional flags for rendering (Checking against the correct lowercase values)
  const isMainLinkMode =
    selectedAssetType === "media" || selectedAssetType === "art";
  const isMainFileMode = selectedAssetType === "voiceover";
  const voiceoverAccept = "audio/*, .mp3, .wav";

  // 🌟 NEW: Flag to control when the input is actually visible (only for 'media', not 'art')
  const isMainLinkInputVisible = selectedAssetType === "media";

  // 🌟 CORE FUNCTION: Handles form data extraction and API call
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission

    setIsLoading(true); // 🌟 START LOADING

    const form = e.currentTarget;
    const formData = new FormData(form);

    // --- 1. Base JSON Data for backend ---
    const jsonData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      // selectedAssetType is already lowercase, ready for DB/Service
      asset_type: selectedAssetType,
      details: {
        // isFeatured and isActive are preserved from the state
        is_featured: isFeatured,
        is_active: isActive,
        tags: [], // Tags removed, set to empty array
      },
      // link and thumbnail_url will be added/managed below
    };

    // --- 2. Create the FINAL FormData for submission ---
    const finalFormData = new FormData();
    const thumbnailFile = formData.get("thumbnail") as File | null;

    // Add thumbnail file (or existing URL if editing and not replacing)
    if (thumbnailFile && thumbnailFile.size > 0) {
      finalFormData.append("thumbnail", thumbnailFile);
    } else if (isEditMode) {
      // Send existing URL if thumbnail wasn't changed
      (jsonData as any).thumbnail_url = assetToEdit!.thumbnailUrl || "";
    }

    // --- 3. Handle Main Content based on Asset Type ---
    if (isMainLinkMode) {
      // MEDIA/ART: Main content is a URL input (or dummy value for ART)

      let linkUrl = formData.get("link_url") as string;

      // *** START: FIX for ART Hiding ***
      if (selectedAssetType === "art") {
        // The input is hidden for ART, but the field is mandatory for the backend.
        // We inject a dummy URL to satisfy the form submission and backend validation.
        linkUrl = "https://placeholder-url.com/art-link";
      }
      // *** END: FIX for ART Hiding ***

      // This validation check now only truly applies to 'media' type.
      if (!linkUrl) {
        setIsLoading(false); // Stop loading before toast
        return toast({
          title: "Validation Error",
          description: "Main Link URL is required.",
          variant: "destructive",
        });
      }
      (jsonData as any).link = linkUrl; // 🌟 UPDATED: Sending as 'link'
    } else if (isMainFileMode) {
      // VOICEOVER: Main content is a file upload
      const mainFile = formData.get("audioFile") as File | null;

      if (mainFile && mainFile.size > 0) {
        // New file uploaded
        finalFormData.append("audioFile", mainFile);
      } else if (isEditMode) {
        // Editing, and no new file was uploaded, so send the existing URL
        (jsonData as any).link_url = assetToEdit!.url || "";
      } else {
        // Creating, and no file uploaded
        setIsLoading(false); // Stop loading before toast
        return toast({
          title: "Validation Error",
          description: "Voice-over file upload is required.",
          variant: "destructive",
        });
      }
    }

    // Append the JSON data as the last part
    finalFormData.append("data", JSON.stringify(jsonData));

    // --- 4. API Endpoint Logic ---
    const method = isEditMode ? "PATCH" : "POST";
    const endpoint = isEditMode
      ? `/portfolio/assets/${assetToEdit!.id}`
      : "/portfolio/assets";

    try {
      await apiFetch(endpoint, {
        method: method,
        credentials: "include",
        body: finalFormData, // Send the compiled FormData
      });

      toast({
        title: "Success",
        description: `Asset ${
          isEditMode ? "updated" : "created"
        } successfully!`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: `Could not save asset: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // 🌟 STOP LOADING
      setOpen(false); // Close dialog on completion (success or fail)
    }
  };

  return (
    <>
      {/* Loading Dialog rendered as a sibling */}
      <LoadingDialog
        open={isLoading}
        message={
          isEditMode ? "Saving asset changes..." : "Creating new asset..."
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? `Update metadata and replace files for asset ID: ${assetToEdit?.id}`
                : "Upload files, which will be converted to URLs by the backend."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            {/* --- Common Fields --- */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="col-span-4 md:col-span-1">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={defaultAsset.title}
                className="col-span-4 md:col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="col-span-4 md:col-span-1">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={defaultAsset.description}
                className="col-span-4 md:col-span-3"
              />
            </div>

            {/* --- Asset Type Selector --- */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assetType" className="col-span-4 md:col-span-1">
                Asset Type
              </Label>
              <Select
                value={selectedAssetType}
                onValueChange={(val) => setSelectedAssetType(val as AssetType)}
              >
                <SelectTrigger className="col-span-4 md:col-span-3">
                  <SelectValue placeholder="Select Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="media">
                    Media Production (Video/Animation)
                  </SelectItem>
                  <SelectItem value="art">
                    Art/Design (Illustrations/Graphics)
                  </SelectItem>
                  <SelectItem value="voiceover">
                    Voice-Overs (Audio Clips)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- Conditional Main Content Input --- */}
            {/* HIDE: Input is now only visible if selectedAssetType === "media" */}
            {isMainLinkInputVisible && (
              <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
                <Label htmlFor="link_url" className="col-span-4 md:col-span-1">
                  Main Content URL
                </Label>
                {/* Display existing URL when editing */}
                <Input
                  id="link_url"
                  name="link_url"
                  defaultValue={defaultAsset.url}
                  placeholder="e.g., https://www.youtube.com/watch?v=video-id OR https://vimeo.com/video-id"
                  className="col-span-4 md:col-span-3"
                  required
                />
              </div>
            )}

            {isMainFileMode && (
              <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
                <Label htmlFor="audioFile" className="col-span-4 md:col-span-1">
                  {isEditMode ? "Replace Audio File" : "Upload Audio File"}
                  <span className="block text-xs text-muted-foreground">
                    VOICEOVER: .mp3, .wav
                  </span>
                </Label>
                <Input
                  id="audioFile"
                  name="audioFile"
                  type="file"
                  className="col-span-4 md:col-span-3"
                  accept={voiceoverAccept}
                />
                {isEditMode && defaultAsset.url && (
                  <div className="col-start-2 col-span-3 text-xs text-muted-foreground pt-1">
                    Current URL:{" "}
                    <a
                      href={defaultAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline truncate"
                    >
                      {defaultAsset.url}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* --- Thumbnail File Upload (Always present) --- */}
            <div
              className={`grid grid-cols-4 items-center gap-4 ${
                isMainLinkMode || isMainFileMode ? "border-t pt-4" : ""
              }`}
            >
              <Label htmlFor="thumbnail" className="col-span-4 md:col-span-1">
                {isEditMode ? "Replace Thumbnail" : "Upload Thumbnail Image"}
                <span className="block text-xs text-muted-foreground">
                  Image file only
                </span>
              </Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                className="col-span-4 md:col-span-3"
                accept="image/*"
              />
              {isEditMode && defaultAsset.thumbnailUrl && (
                <div className="col-start-2 col-span-3 pt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Current Thumbnail Preview:
                  </p>
                  <img
                    src={defaultAsset.thumbnailUrl}
                    alt="Current Thumbnail"
                    className="w-40 h-auto object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              {/* DISABLED: Cancel button disabled while loading */}
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {/* DISABLED: Submit button disabled and shows spinner while loading */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
