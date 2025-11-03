// app/admin/inquiries/page.tsx

"use client";

import { useState } from "react";
import { Mail, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { STATIC_INQUIRIES } from "@/lib/inquiries";
import { ContactInquiry, InquiryStatus } from "@/lib/models";

// --- Import Placeholder Components ---
import { InquiriesDataTable } from "@/components/inquiries/InquiriesDataTable";
import { InquiryViewDialog } from "@/components/inquiries/InquiryViewDialog";

export default function InquiriesPage() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState<
    ContactInquiry | undefined
  >(undefined);

  // Handler for viewing details
  const handleView = (inquiry: ContactInquiry) => {
    setViewingInquiry(inquiry);
    setIsViewDialogOpen(true);
  };

  // Handler for updating status (simulated)
  const handleUpdateStatus = (inquiryId: string, newStatus: InquiryStatus) => {
    console.log(`Simulating status update for ${inquiryId} to ${newStatus}`);
    // In a real app, this would trigger an API call and state re-fetch.
    alert(`Status for ${inquiryId} updated to ${newStatus}`);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-7 w-7" />
          Contact Inquiries
        </h1>
        {/* Placeholder for an action that might exist, like "Manage Filters" */}
        <Button variant="outline">
          <Settings2 className="mr-2 h-4 w-4" />
          Quick Settings
        </Button>
      </div>

      {/* Reusable View Details Dialog Component */}
      <InquiryViewDialog
        open={isViewDialogOpen}
        setOpen={setIsViewDialogOpen}
        inquiry={viewingInquiry}
        onUpdateStatus={handleUpdateStatus}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Inbox ({STATIC_INQUIRIES.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Render the DataTable with all inquiries */}
          <InquiriesDataTable data={STATIC_INQUIRIES} onView={handleView} />
        </CardContent>
      </Card>
    </main>
  );
}
