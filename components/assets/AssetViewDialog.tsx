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
  asset?: PortfolioAsset; // Use camelCase model
}

export const AssetViewDialog: React.FC<AssetViewDialogProps> = ({
  open,
  setOpen,
  asset,
}) => {
  if (!asset) return null;

  // ✅ Use camelCase keys only
  const { title, assetType, description, url, thumbnailUrl } = asset;

  // Ensure assetType is uppercase for comparison
  const displayAssetType = assetType ? assetType.toUpperCase() : "UNKNOWN";

  const isValidUrl = (u: string | undefined | null): u is string =>
    !!u && (u.startsWith("http://") || u.startsWith("https://"));

  const renderMediaPreview = () => {
    const validUrl = isValidUrl(url) ? url : undefined;
    const validThumbnail = isValidUrl(thumbnailUrl) ? thumbnailUrl : undefined;

    let primaryUrl: string | undefined;

    // --- Determine Primary URL based on type ---
    if (displayAssetType === "ART") {
      primaryUrl = validThumbnail;
    } else {
      primaryUrl = validUrl || validThumbnail;
    }

    if (!primaryUrl) {
      return (
        <div className="text-center p-8 bg-secondary/10 rounded-lg">
          No primary content link available.
        </div>
      );
    }

    // --- UPDATED: Group all video/link types ---
    switch (displayAssetType) {
      case "TVHOST":
      case "MCING":
      case "INTERVIEWS":
      // The original "MEDIA" type is not explicitly in the backend anymore,
      // but keeping it for compatibility if older data exists:
      case "MEDIA":
        return (
          // NOTE: This assumes the 'url' points to a playable video file or a video player link.
          // If the URL is just a link to a YouTube/Vimeo page, it might not render directly
          // in a <video> tag. A full embed component would be needed for perfect rendering.
          // For simple admin viewing, we assume a direct link or render thumbnail + external link.

          <div className="space-y-4">
            {/* Show the thumbnail and a button to view the link */}
            {validThumbnail && (
              <div className="w-full h-96 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                <Image
                  src={validThumbnail}
                  alt={`${title} thumbnail`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Preview displays the thumbnail. Click the link below to view the
              full content.
            </p>
            <a
              href={validUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold block truncate"
            >
              View Content Link
            </a>
          </div>
        );
      case "VOICEOVER":
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg space-y-4">
            {validThumbnail && (
              <div className="w-full h-48 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                <Image
                  src={validThumbnail}
                  alt={`${title} voiceover thumbnail`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="p-2"
                />
              </div>
            )}
            <Label className="text-sm font-semibold">Audio Preview</Label>
            {/* This assumes primaryUrl is the direct audio file link */}
            <audio controls src={primaryUrl} className="w-full max-w-sm" />
          </div>
        );
      case "ART":
        return (
          <div className="w-full h-96 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
            {/* For ART, we use the primaryUrl (which is the thumbnail) for display */}
            <Image
              src={primaryUrl}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              className="p-2"
            />
          </div>
        );
      default:
        return (
          <p>
            No specific preview handler available for this asset type (
            {displayAssetType}).
          </p>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>👀 View Asset Details: {title}</DialogTitle>
          <DialogDescription>
            Full details and preview for the selected portfolio item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="md:col-span-2">{renderMediaPreview()}</div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Asset Metadata
            </h3>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Type
              </Label>
              {/* Show the cleaned type */}
              <p className="font-bold text-lg">{displayAssetType}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="text-sm">{description}</p>
            </div>

            {/* --- Display Full URL --- */}
            <Separator />
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Content Link (URL)
              </Label>
              {isValidUrl(url) ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline block truncate max-w-full"
                >
                  {url}
                </a>
              ) : (
                <p className="text-sm italic text-red-500">
                  No content link provided.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
