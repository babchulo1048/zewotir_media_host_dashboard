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

  const displayAssetType = assetType ? assetType.toUpperCase() : "UNKNOWN";

  const isValidUrl = (u: string | undefined | null): u is string =>
    !!u && (u.startsWith("http://") || u.startsWith("https://"));

  const renderMediaPreview = () => {
    const validUrl = isValidUrl(url) ? url : undefined;
    const validThumbnail = isValidUrl(thumbnailUrl) ? thumbnailUrl : undefined;

    let primaryUrl: string | undefined;

    if (displayAssetType === "ART") {
      primaryUrl = validThumbnail;
    } else {
      primaryUrl = validUrl || validThumbnail;
    }

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
          <video
            src={primaryUrl}
            controls
            className="w-full max-h-96 rounded-lg border shadow-lg"
            poster={validThumbnail}
          />
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
            <audio controls src={primaryUrl} className="w-full max-w-sm" />
          </div>
        );
      case "ART":
        return (
          <div className="w-full h-96 relative rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
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
        return <p>No preview available for this asset type.</p>;
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
              <p className="font-bold text-lg">{displayAssetType}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <p className="text-sm">{description}</p>
            </div>

            <Separator />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
