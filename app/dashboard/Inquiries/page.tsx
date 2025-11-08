// app/admin/inquiries/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react"; // 👈 Import useEffect and useCallback
import { Mail, Settings2, Loader2 } from "lucide-react"; // 👈 Import Loader2
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// REMOVE: import { STATIC_INQUIRIES } from "@/lib/inquiries"; // 👈 Remove static import
import { ContactInquiry, InquiryStatus } from "@/lib/models"; // Keep model for type hinting
// NOTE: We will treat the API response objects as ContactInquiry even if fields are different.

// --- Import Placeholder Components ---
import { InquiriesDataTable } from "@/components/inquiries/InquiriesDataTable";
import { InquiryViewDialog } from "@/components/inquiries/InquiryViewDialog";

// Define your API endpoint
const API_URL = "http://localhost:3001/api/v1/contact/inquiries";

export default function InquiriesPage() {
  // Use 'any' temporarily or define a new model if the backend is finalized
  const [inquiries, setInquiries] = useState<any[]>([]); // 👈 New state for dynamic inquiries
  const [isLoading, setIsLoading] = useState(true); // 👈 New state for loading
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState<any | undefined>( // Updated type
    undefined
  );

  // Function to fetch inquiries from the API
  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
      }
      // Assuming your API returns an array of inquiry objects directly
      const data: any[] = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setInquiries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries(); // Fetch data when the component mounts
  }, [fetchInquiries]);

  // Handler for viewing details
  const handleView = (inquiry: any) => {
    // Updated type
    setViewingInquiry(inquiry);
    setIsViewDialogOpen(true);
  };

  // Handler for updating status (simulated - replace with API call later)
  const handleUpdateStatus = (
    inquiryId: string | number,
    newStatus: InquiryStatus
  ) => {
    console.log(`Simulating status update for ${inquiryId} to ${newStatus}`);
    // Future: API Call to update status.
    // fetch(`/api/v1/contact/inquiries/${inquiryId}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) })

    // For now, alert and refresh the list to simulate change propagation:
    alert(
      `Status for Inquiry ID ${inquiryId} updated to ${newStatus}. Refreshing list...`
    );
    fetchInquiries();
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-7 w-7" />
          Contact Inquiries
        </h1>
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
        // Ensure ID passed to handler is the correct type (number or string)
        onUpdateStatus={(id, status) => handleUpdateStatus(id, status)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Inbox ({isLoading ? "..." : inquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-lg">Loading inquiries...</span>
            </div>
          ) : (
            /* Render the DataTable with dynamic inquiries */
            <InquiriesDataTable data={inquiries} onView={handleView} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
