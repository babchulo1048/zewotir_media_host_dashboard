// app/admin/inquiries/_components/InquiriesDataTable.tsx

import { ColumnDef } from "@tanstack/react-table";
import { ContactInquiry } from "@/lib/models";
import { DataTable } from "../table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InquiriesDataTableProps {
  data: ContactInquiry[];
  onView: (inquiry: ContactInquiry) => void;
}

const getStatusBadge = (status: ContactInquiry["status"]) => {
  switch (status) {
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
  onView: (inquiry: ContactInquiry) => void;
}) => ColumnDef<ContactInquiry>[] = ({ onView }) => [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Subject
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[400px] truncate">
        {row.getValue("subject")}
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
    accessorKey: "receivedAt",
    header: "Received",
    cell: ({ row }) => {
      const date = new Date(row.getValue("receivedAt") as string);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
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

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "subject", title: "Subjects" }]}
    />
  );
}
