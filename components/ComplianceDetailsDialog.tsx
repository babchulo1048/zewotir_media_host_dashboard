"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Compliance } from "@/lib/models";
import { CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";
import instance from "@/lib/axios";
import { FileViewer } from "@/components/shared/FileViewer"; // Import the new FileViewer

interface ComplianceDetailsDialogProps {
  compliance: Compliance;
}

export function ComplianceDetailsDialog({
  compliance,
}: ComplianceDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("compliance:", compliance);

  // State for file viewer
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  const handleViewFile = (url: string, name: string) => {
    setCurrentFileUrl(url);
    setCurrentFileName(name);
    setFileViewerOpen(true);
  };

  const handleApprove = async () => {
    setIsLoading(true);
    // NOTE: Replace this with the actual userId from your authentication state.
    const userId = localStorage.getItem("userId");
    const businessId = compliance?.merchantBusiness?.businessId;

    try {
      const response = await instance.post(
        `/compliance/${businessId}/approve?approvedBy=${userId}`
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Compliance approved successfully!"
        );
        setOpen(false);
        // Force a page reload to refresh the data after approval
        location.reload();
      } else {
        toast.error(response.data.message || "Failed to approve compliance.");
      }
    } catch (error) {
      console.error("Failed to approve compliance:", error);
      toast.error("Failed to approve compliance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl space-y-4">
        <DialogHeader>
          <DialogTitle>Compliance Details</DialogTitle>
        </DialogHeader>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
          {/* Merchant Info */}
          <div>
            <strong className="text-gray-500">Merchant Email:</strong>
            <br />
            {compliance.merchant.email}
          </div>
          <div>
            <strong className="text-gray-500">Legal Business Name:</strong>
            <br />
            {compliance.legalBusinessName}
          </div>
          <div>
            <strong className="text-gray-500">Status:</strong>
            <br />
            <div className="flex items-center gap-1">
              {compliance.approved ? (
                <CircleCheck className="h-4 w-4 text-green-500" />
              ) : (
                <CircleX className="h-4 w-4 text-red-500" />
              )}
              {compliance.approved ? "Approved" : "Pending"}
            </div>
          </div>
          {/* Business Info */}
          <div>
            <strong className="text-gray-500">TIN Number:</strong>
            <br />
            {compliance.tinNumber}
          </div>
          <div>
            <strong className="text-gray-500">Business Registration No:</strong>
            <br />
            {compliance.businessRegistrationNo}
          </div>
          <div>
            <strong className="text-gray-500">VAT Registered:</strong>
            <br />
            {compliance.vatRegistered ? "Yes" : "No"}
          </div>
          {compliance.vatRegistered && (
            <div>
              <strong className="text-gray-500">VAT No:</strong>
              <br />
              {compliance.vatNo}
            </div>
          )}

          {/* Location & Industry */}
          <div>
            <strong className="text-gray-500">Industry:</strong>
            <br />
            {compliance.industry.industryName}
          </div>
          <div>
            <strong className="text-gray-500">State:</strong>
            <br />
            {compliance.state.stateName}
          </div>
          <div>
            <strong className="text-gray-500">Sub City:</strong>
            <br />
            {compliance.subCity.subCityName}
          </div>
          <div>
            <strong className="text-gray-500">Business Address:</strong>
            <br />
            {compliance.businessAddress}
          </div>
          <div>
            <strong className="text-gray-500">Staff Size:</strong>
            <br />
            {compliance.staffSize.staffSizeName}
          </div>
          <div>
            <strong className="text-gray-500">Transaction Volume:</strong>
            <br />
            {compliance?.transactionVolume?.transactionVolumeName}
          </div>

          {/* Dates */}
          <div>
            <strong className="text-gray-500">Submitted At:</strong>
            <br />
            {compliance.submittedAt
              ? new Date(compliance.submittedAt).toLocaleString()
              : "N/A"}
          </div>
          <div>
            <strong className="text-gray-500">Approved At:</strong>
            <br />
            {compliance.approvedAt
              ? new Date(compliance.approvedAt).toLocaleString()
              : "N/A"}
          </div>

          {/* File Viewers */}
          {compliance.vatFile && (
            <div>
              <strong className="text-gray-500">VAT File:</strong>
              <br />
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => handleViewFile(compliance.vatFile!, "VAT File")}
              >
                View VAT File
              </Button>
            </div>
          )}
          {compliance.tradeLicenseFile && (
            <div>
              <strong className="text-gray-500">Trade License File:</strong>
              <br />
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  handleViewFile(
                    compliance.tradeLicenseFile!,
                    "Trade License File"
                  )
                }
              >
                View Trade License File
              </Button>
            </div>
          )}
          {compliance.tinCertificateFile && (
            <div>
              <strong className="text-gray-500">TIN Certificate File:</strong>
              <br />
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() =>
                  handleViewFile(
                    compliance.tinCertificateFile!,
                    "TIN Certificate File"
                  )
                }
              >
                View TIN Certificate File
              </Button>
            </div>
          )}
        </section>

        <DialogFooter>
          {!compliance.approved && (
            <Button onClick={handleApprove} disabled={isLoading}>
              Approve
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* File Viewer Dialog */}
      <FileViewer
        isOpen={fileViewerOpen}
        onClose={() => setFileViewerOpen(false)}
        fileUrl={currentFileUrl}
        fileName={currentFileName}
      />
    </Dialog>
  );
}
