// app/admin/blog/_components/PostsDataTable.tsx

import { ColumnDef } from "@tanstack/react-table";
import { BlogPost } from "@/lib/models";
import { DataTable } from "../table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostsDataTableProps {
  // NOTE: You might need to update your BlogPost model to reflect the new structure,
  // but we'll use property accessors here based on the data provided.
  data: any[]; // Using 'any' temporarily if BlogPost model isn't updated, or update BlogPost
  onEdit: (post: any) => void;
  onView: (post: any) => void;
}

// NOTE: Since 'status' is not in the API payload, we remove getStatusBadge unless we default it.

// Define the specific columns for Blog Posts
const postColumns: (handlers: {
  onEdit: (post: any) => void; // Update type to 'any' or new model
  onView: (post: any) => void; // Update type to 'any' or new model
}) => ColumnDef<any>[] = ({ onEdit, onView }) => [
  // Update ColumnDef type
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
    // RENAME: Change accessorKey from "summary" to "excerpt"
    accessorKey: "excerpt",
    header: "Summary/Excerpt",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[350px] truncate">
        {row.getValue("excerpt")}
      </div>
    ),
  },
  {
    // NEW COLUMN: Add category
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("category")}</Badge>
    ),
  },
  {
    // CHANGE: Use "created_at" since "publishedAt" is not available
    accessorKey: "created_at",
    header: "Created On",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string | null;
      if (!date)
        return <span className="text-muted-foreground italic">N/A</span>;
      // Use toLocaleDateString for a cleaner display
      return new Date(date).toLocaleDateString();
    },
  },
  // REMOVE: The 'status' column is removed as the field is not present in the API payload

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
  // Ensure the PostColumns function uses the updated 'any' type if the model hasn't been changed.
  const columns = postColumns({ onEdit, onView });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "title", title: "Titles" }]}
    />
  );
}
