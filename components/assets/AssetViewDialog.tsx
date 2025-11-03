"use client";

import { PortfolioAsset } from "@/lib/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface AssetViewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  asset?: PortfolioAsset; // The asset to display
}

export const AssetViewDialog: React.FC<AssetViewDialogProps> = ({
  open,
  setOpen,
  asset,
}) => {
  // If no asset is provided, don't render the content
  if (!asset) return null;

  // Access all properties using the snake_case keys returned by the backend
  const {
    title,
    asset_type,
    description,
    link_url,
    thumbnail_url,
    // is_active, is_featured, created_at, id are removed from destructuring since they are not used
  } = asset;

  const displayAssetType = asset_type ? asset_type.toUpperCase() : "UNKNOWN";

  // Helper function to check if a string is a valid, non-empty URL string AND has a protocol
  const isValidUrl = (url: string | null | undefined): url is string => {
    if (typeof url !== "string" || url.trim().length === 0) {
      return false;
    }
    // Check if the URL starts with http:// or https:// (essential for Next.js Image)
    return (
      url.trim().startsWith("http://") || url.trim().startsWith("https://")
    );
  };

  // Function to render the media preview based on asset type
  const renderMediaPreview = () => {
    // 1. Check valid URLs for both fields
    const validLinkUrl = isValidUrl(link_url) ? link_url : undefined;
    const validThumbnailUrl = isValidUrl(thumbnail_url)
      ? thumbnail_url
      : undefined;

    let primaryUrl: string | undefined;

    // 🌟 FIX: Check asset type before determining primary URL
    if (displayAssetType === "ART") {
      // For ART, only use the thumbnail URL, completely ignoring the link_url (which might be the dummy placeholder)
      primaryUrl = validThumbnailUrl;
    } else {
      // For MEDIA/VOICEOVER, prioritize the main link, then fall back to the thumbnail
      primaryUrl = validLinkUrl || validThumbnailUrl;
    }

    // If no valid URL is found for the content
    if (!primaryUrl) {
      return (
        <div className="text-center p-8 bg-secondary/10 rounded-lg">
          No primary content available.
        </div>
      );
    }

    switch (displayAssetType) {
      case "MEDIA":
        return (
          // Video preview
          <video
            src={primaryUrl}
            controls
            className="w-full max-h-96 rounded-lg border shadow-lg"
            poster={validThumbnailUrl} // Use validated thumbnail URL for poster
          >
            Your browser does not support the video tag.
          </video>
        );
      case "VOICEOVER":
        return (
          // Audio preview with thumbnail
          <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-4">
            {/* Display thumbnail image if available */}
            {validThumbnailUrl && (
              <div className="w-full h-48 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                <Image
                  src={validThumbnailUrl}
                  alt={`${title} voiceover thumbnail`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="p-2"
                />
              </div>
            )}
            <Label className="text-sm font-semibold">Audio Preview</Label>
            <audio controls src={primaryUrl} className="w-full max-w-sm">
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "ART":
        // Image preview (Next.js Image) - Now guaranteed to use a valid thumbnail or fail gracefully above
        return (
          <div className="w-full h-96 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
            <Image
              src={primaryUrl} // This is now guaranteed to be the valid thumbnail URL
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              className="p-2"
            />
          </div>
        );
      default:
        return <p>No specific preview handler for this asset type.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>👀 View Asset Details: **{title}**</DialogTitle>
          <DialogDescription>
            Full details and preview for the selected portfolio item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {/* --- Column 1: Media Preview (Span 2) --- */}
          <div className="md:col-span-2">{renderMediaPreview()}</div>

          {/* --- Column 2: Metadata (Span 1) --- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Asset Metadata
            </h3>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Type
              </Label>
              <p className="font-bold text-lg">{displayAssetType}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="text-sm">{description}</p>
            </div>

            <Separator />

            {/* Status, Tags, Created At, and ID sections are intentionally removed */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
