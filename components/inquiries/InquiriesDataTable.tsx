// app/admin/inquiries/_components/InquiriesDataTable.tsx

import { ColumnDef } from "@tanstack/react-table";
import { ContactInquiry } from "@/lib/models"; // Keeping import for status types
import { DataTable } from "../table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InquiriesDataTableProps {
  data: any[]; // 👈 Updated to 'any'
  onView: (inquiry: any) => void; // 👈 Updated to 'any'
}

// NOTE: Since the API doesn't provide a status, we'll default it to 'NEW' for display.
const getStatusBadge = (status: string) => {
  const currentStatus = status || "NEW"; // Default to NEW
  switch (currentStatus) {
    case "NEW":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse">
          NEW
        </Badge>
      );
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    case "RESOLVED":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
      );
    case "SPAM":
      return <Badge variant="destructive">Spam</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Define the specific columns for Inquiries
const inquiryColumns: (handlers: {
  onView: (inquiry: any) => void; // 👈 Updated type
}) => ColumnDef<any>[] = ({ onView }) => [
  // 👈 Updated type
  {
    // Use an arbitrary accessorKey and display the defaulted status
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status), // status is likely undefined, so it defaults to 'NEW'
  },
  {
    // RENAME: Change accessorKey from "subject" to "inquiry_type"
    accessorKey: "inquiry_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Inquiry Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[400px] truncate">
        {row.getValue("inquiry_type")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Sender",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    // RENAME: Change accessorKey from "receivedAt" to "created_at"
    accessorKey: "created_at",
    header: "Received",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit", // Include time for better context
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="icon"
        onClick={() => onView(row.original)}
        title="View Full Message"
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export function InquiriesDataTable({ data, onView }: InquiriesDataTableProps) {
  const columns = inquiryColumns({ onView });

  // Update searchable column key to match the new API field
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "inquiry_type", title: "Inquiry Types" }]} // 👈 Updated searchable column
    />
  );
}
