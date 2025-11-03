// app/admin/resumes/_components/ResumesDataTable.tsx

import { ColumnDef } from "@tanstack/react-table";
import { ResumeDocument } from "@/lib/models";
import { DataTable } from "../table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumesDataTableProps {
  data: ResumeDocument[];
  onEdit: (doc: ResumeDocument) => void;
}

const getStatusBadge = (status: ResumeDocument["status"]) => {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-green-500 hover:bg-green-600">ACTIVE</Badge>;
    case "DRAFT":
      return <Badge variant="secondary">DRAFT</Badge>;
    case "ARCHIVED":
      return <Badge variant="destructive">ARCHIVED</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Define the specific columns for Resume Documents
const resumeColumns: (handlers: {
  onEdit: (doc: ResumeDocument) => void;
}) => ColumnDef<ResumeDocument>[] = ({ onEdit }) => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Document Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("title")}
        {row.original.isPrimary && (
          <Star
            className="h-4 w-4 text-yellow-500 ml-2 inline-block"
            title="Primary Resume"
          />
        )}
      </div>
    ),
  },
  {
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "uploadedAt",
    header: "Uploaded On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("uploadedAt") as string);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <a
          href={row.original.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="icon" title="Download Document">
            <Download className="h-4 w-4" />
          </Button>
        </a>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onEdit(row.original)}
          title="Edit Metadata"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function ResumesDataTable({ data, onEdit }: ResumesDataTableProps) {
  const columns = resumeColumns({ onEdit });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "title", title: "Titles" }]}
    />
  );
}
