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
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Microfinance } from "@/lib/models"; // Assuming Microfinance model
import { toast } from "sonner";
import instance from "@/lib/axios";

interface MicrofinanceFormDialogProps {
  children: React.ReactNode;
  microfinance?: Microfinance;
  onSuccess: () => void;
}

export function MicrofinanceFormDialog({
  children,
  microfinance,
  onSuccess,
}: MicrofinanceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. STATE VARIABLES FOR ALL FIELDS
  const [name, setName] = useState(microfinance?.name || "");
  const [email, setEmail] = useState(microfinance?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    microfinance?.phoneNumber || ""
  );
  const [licenseNumber, setLicenseNumber] = useState(
    microfinance?.licenseNumber || ""
  );
  const [address, setAddress] = useState(microfinance?.address || "");
  const [ownerName, setOwnerName] = useState(microfinance?.ownerName || "");
  const [tinNumber, setTinNumber] = useState(microfinance?.tinNumber || "");
  const [description, setDescription] = useState(
    microfinance?.description || ""
  );
  const [secretHash, setSecretHash] = useState(microfinance?.secretHash || "");
  const [merchantId, setMerchantId] = useState(microfinance?.merchantId || "");

  useEffect(() => {
    if (microfinance) {
      // 2. INITIALIZE ALL STATE VARIABLES FROM microfinance PROP
      setName(microfinance.name || "");
      // Note: If you are updating, the email property in the payload is ignored by your backend
      // for the Microfinance entity update, but is included here for POST (create).
      // We keep it for consistency or for the "create" path.
      setEmail(microfinance.user?.email || "");
      setPhoneNumber(microfinance.phoneNumber || "");
      setLicenseNumber(microfinance.licenseNumber || "");
      setAddress(microfinance.address || "");
      setOwnerName(microfinance.ownerName || "");
      setTinNumber(microfinance.tinNumber || "");
      setDescription(microfinance.description || "");
      setSecretHash(microfinance.secretHash || "");
      setMerchantId(microfinance.merchantId || "");
    } else {
      // Clear fields when adding new
      setName("");
      setEmail("");
      setPhoneNumber("");
      setLicenseNumber("");
      setAddress("");
      setOwnerName("");
      setTinNumber("");
      setDescription("");
      setSecretHash("");
      setMerchantId("");
    }
  }, [microfinance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !phoneNumber ||
      !licenseNumber ||
      !address ||
      !ownerName ||
      !tinNumber
    ) {
      toast.error(
        "Required fields (Name, Phone, License, Address, Owner, TIN) must be filled."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("licenseNumber", licenseNumber);
      formData.append("address", address);
      formData.append("ownerName", ownerName);
      formData.append("tinNumber", tinNumber);
      formData.append("registrationDate", "2025-10-03T10:00:00"); // static example, you can make it dynamic
      formData.append("description", description);
      formData.append("merchantId", merchantId);
      formData.append("secretHash", secretHash);
      formData.append("accountBalance", "0"); // default
      formData.append("microTypeName", "MICROFINANCE");

      // File upload (logo)
      if ((document.getElementById("logo") as HTMLInputElement)?.files?.[0]) {
        formData.append(
          "logo",
          (document.getElementById("logo") as HTMLInputElement).files![0]
        );
      }

      if (microfinance) {
        await instance.put(
          `/admin/microfinances/${microfinance.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Microfinance updated successfully!");
      } else {
        await instance.post("/admin/register-microfinance", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Microfinance added successfully!");
      }

      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save microfinance:", error);
      toast.error("Failed to save microfinance. Please check server logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* CRITICAL CHANGE: Added classes for scrollability 
        - max-h-[90vh]: Restricts the maximum height to 90% of the viewport height.
        - overflow-y-auto: Enables vertical scrolling when the content exceeds the max height.
        - flex flex-col: Ensures the header stays fixed and only the body scrolls.
      */}
      <DialogContent className="sm:max-w-[425px] md:max-w-xl max-h-[90vh] overflow-y-auto flex flex-col p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {microfinance ? "Edit Microfinance" : "Add New Microfinance"}
          </DialogTitle>
        </DialogHeader>
        {/* The form takes up the remaining height and handles its own content flow */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-visible"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Microfinance Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Owner's Full Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tinNumber">TIN Number</Label>
            <Input
              id="tinNumber"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              placeholder="e.g., 000-000-000"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="e.g., LIC12345"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="City, Street, Building"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="merchantId">Merchant ID</Label>
            <Input
              id="merchantId"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="e.g., 141131"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="secretHash">Secret Hash</Label>
            <Input
              id="secretHash"
              value={secretHash}
              onChange={(e) => setSecretHash(e.target.value)}
              placeholder="Secret Hash for API"
            />
          </div>

          {/* Email input is only strictly needed for POST (create) */}
          {!microfinance && (
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="email">Email (For initial user creation)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@mfi.com"
              />
            </div>
          )}

          <div className="grid gap-2 col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            {/* Assuming you have a Textarea component or use the Input for multi-line */}
            {/* NOTE: If you replace Input with Textarea, adjust its import and usage */}
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the microfinance institution..."
            />
          </div>

          <div className="grid gap-2 col-span-2">
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" accept="image/*" />
          </div>

          {/* Footer controls are outside the primary scrollable form grid for better UX */}
          <div className="flex justify-end gap-2 col-span-2 mt-4 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? microfinance
                  ? "Updating..."
                  : "Adding..."
                : microfinance
                ? "Update Microfinance"
                : "Add Microfinance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
