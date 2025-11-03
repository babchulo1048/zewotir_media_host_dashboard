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
  inquiry?: ContactInquiry;
  onUpdateStatus: (inquiryId: string, newStatus: InquiryStatus) => void;
}

export const InquiryViewDialog: React.FC<InquiryViewDialogProps> = ({
  open,
  setOpen,
  inquiry,
  onUpdateStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState<InquiryStatus | undefined>(
    inquiry?.status
  );

  // Sync internal state when the dialog opens or the inquiry changes
  useEffect(() => {
    if (inquiry) {
      setCurrentStatus(inquiry.status);
    }
  }, [inquiry, open]);

  if (!inquiry) return null;

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as InquiryStatus);
  };

  const handleSaveStatus = () => {
    if (inquiry.id && currentStatus && currentStatus !== inquiry.status) {
      onUpdateStatus(inquiry.id, currentStatus);
      // Close dialog after action (or handle API response)
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Full Inquiry: **{inquiry.subject}**</DialogTitle>
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
                **Received:** {new Date(inquiry.receivedAt).toLocaleString()}
              </p>
              <p>Source: **{inquiry.source}**</p>
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
            <h3 className="text-xl font-bold">{inquiry.subject}</h3>
            <Label className="text-sm font-medium text-muted-foreground">
              Message
            </Label>
            <div className="p-4 border rounded-lg bg-muted/50 text-base leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
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
            disabled={currentStatus === inquiry.status} // Disable if status hasn't changed
          >
            Save Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
