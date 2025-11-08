// app/admin/inquiries/_components/InquiryViewDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { ContactInquiry, InquiryStatus } from "@/lib/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Clock, User } from "lucide-react";

interface InquiryViewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  inquiry?: any; // 👈 Updated to 'any'
  onUpdateStatus: (
    inquiryId: string | number,
    newStatus: InquiryStatus
  ) => void; // Allow string or number ID
}

export const InquiryViewDialog: React.FC<InquiryViewDialogProps> = ({
  open,
  setOpen,
  inquiry,
  onUpdateStatus,
}) => {
  // Use a fallback status, assuming NEW if not provided by the API (or initial state)
  const initialStatus = (inquiry?.status as InquiryStatus) || "NEW";
  const [currentStatus, setCurrentStatus] =
    useState<InquiryStatus>(initialStatus);

  // Sync internal state when the dialog opens or the inquiry changes
  useEffect(() => {
    if (inquiry) {
      setCurrentStatus((inquiry.status as InquiryStatus) || "NEW");
    }
  }, [inquiry, open]);

  if (!inquiry) return null;

  // --- MAPPING NEW API FIELDS ---
  const inquiryType = inquiry.inquiry_type; // Replaces subject
  const receivedAt = inquiry.created_at; // Replaces receivedAt

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as InquiryStatus);
  };

  const handleSaveStatus = () => {
    // We compare to the initial status (which is defaulted to NEW if API doesn't send one)
    if (inquiry.id && currentStatus && currentStatus !== initialStatus) {
      onUpdateStatus(inquiry.id, currentStatus);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Use inquiry_type for the title */}
          <DialogTitle>Full Inquiry: **{inquiryType}**</DialogTitle>
          <DialogDescription>
            Review the complete message and update the resolution status.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {/* --- Column 1: Sender & Metadata --- */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Sender Details
            </h3>

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <Label className="font-medium">{inquiry.name}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${inquiry.email}`}
                className="text-sm hover:text-primary underline"
              >
                {inquiry.email}
              </a>
            </div>

            {/* Phone is not in the API payload, keep as optional */}
            {inquiry.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{inquiry.phone}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                {/* Use created_at field */}
                **Received:** {new Date(receivedAt).toLocaleString()}
              </p>
              {/* Source is not in the API payload, use fallback/omit */}
              {inquiry.source && <p>Source: **{inquiry.source}**</p>}
              <p className="text-xs text-muted-foreground">ID: {inquiry.id}</p>
            </div>

            <Separator />

            {/* Status Update Control */}
            <div className="space-y-2">
              <Label htmlFor="status-select">Update Status</Label>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select New Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">NEW (Unopened)</SelectItem>
                  <SelectItem value="PENDING">PENDING (In Progress)</SelectItem>
                  <SelectItem value="RESOLVED">
                    RESOLVED (Action Complete)
                  </SelectItem>
                  <SelectItem value="SPAM">SPAM (Junk)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- Column 2 & 3: Message Content --- */}
          <div className="md:col-span-2 space-y-4 border-l pl-6">
            <h3 className="text-xl font-bold">{inquiryType}</h3>
            <Label className="text-sm font-medium text-muted-foreground">
              Message
            </Label>
            <div className="p-4 border rounded-lg bg-muted/50 text-base leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
              {/* Use message field */}
              {inquiry.message}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            onClick={handleSaveStatus}
            // Disable if status hasn't changed from the initial/current API value
            disabled={currentStatus === initialStatus}
          >
            Save Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
