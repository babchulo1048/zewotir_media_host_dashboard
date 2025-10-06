"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLiveMode } from "@/context/LiveModeContext";
import { useBusinessContext } from "@/context/BusinessContext";
import { toast } from "sonner";
import instance from "@/lib/axios";

/**
 * A toggle to switch between Test and Live modes.
 * It checks for a live API key before allowing the switch to live mode.
 * @param {object} props
 * @param {() => void} props.onRedirect A function to call to redirect to the compliance tab.
 */
export function LiveToggle({ onRedirect }: { onRedirect: () => void }) {
  const { isLive, toggleLive } = useLiveMode();
  const { businessId } = useBusinessContext();
  const [isChecking, setIsChecking] = useState(false);

  const handleToggle = async (value: boolean) => {
    if (!businessId) {
      toast.error("No business selected.");
      return;
    }

    if (!value) {
      toggleLive(false);
      console.log("Switched to Test Mode");
      return;
    }

    setIsChecking(true);
    try {
      const response = await instance.get(
        `/merchant/business/${businessId}?isLive=true`
      );
      if (response.data.success && response.data.data.isLive) {
        toggleLive(true);
        console.log("Switched to Live Mode");
        toast.success("Successfully switched to Live Mode!");
      } else {
        toast.error("Live API key not found. Please complete compliance.");
        if (onRedirect) {
          onRedirect();
        }
      }
    } catch (error) {
      console.error("Live key check failed:", error);
      toast.error(
        "Live API key not found. Please complete compliance to get a live key."
      );
      if (onRedirect) {
        onRedirect();
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="live-mode-toggle" className="text-medium">
        {isLive ? "Live" : "Test"}
      </Label>
      <Switch
        id="live-mode-toggle"
        checked={isLive}
        onCheckedChange={handleToggle}
        disabled={isChecking}
      />
    </div>
  );
}
