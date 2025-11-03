// app/admin/blog/_components/PostsDataTable.tsx

import { ColumnDef } from "@tanstack/react-table";
import { BlogPost } from "@/lib/models";
import { DataTable } from "../table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostsDataTableProps {
  data: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onView: (post: BlogPost) => void;
}

const getStatusBadge = (status: BlogPost["status"]) => {
  switch (status) {
    case "PUBLISHED":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">PUBLISHED</Badge>
      );
    case "DRAFT":
      return <Badge variant="secondary">DRAFT</Badge>;
    case "ARCHIVED":
      return <Badge variant="destructive">ARCHIVED</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Define the specific columns for Blog Posts
const postColumns: (handlers: {
  onEdit: (post: BlogPost) => void;
  onView: (post: BlogPost) => void;
}) => ColumnDef<BlogPost>[] = ({ onEdit, onView }) => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium max-w-[300px] truncate">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[350px] truncate">
        {row.getValue("summary")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "publishedAt",
    header: "Published On",
    cell: ({ row }) => {
      const date = row.getValue("publishedAt") as string | null;
      if (!date)
        return <span className="text-muted-foreground italic">N/A</span>;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onView(row.original)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onEdit(row.original)}
          title="Edit Post"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function PostsDataTable({ data, onEdit, onView }: PostsDataTableProps) {
  const columns = postColumns({ onEdit, onView });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "title", title: "Titles" }]}
    />
  );
}
