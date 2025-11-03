import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../table/DataTable"; // Your generic DataTable component
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Changed to use the generic UI path
import { AssetType, PortfolioAsset } from "@/lib/models";
import Image from "next/image"; // For rendering the thumbnail
import LoadingDialog from "../shared/LoadingDialog";

// 1. Define the props to include all handlers and state
interface AssetsDataTableProps {
  data: PortfolioAsset[];
  assetType: AssetType;
  onEdit: (asset: PortfolioAsset) => void;
  onView: (asset: PortfolioAsset) => void;
  onDelete: (asset: PortfolioAsset) => void;
  isLoading: boolean; // Required for the final component
}

// 2. Define the specific columns for Portfolio Assets
const assetColumns: (handlers: {
  onEdit: (asset: PortfolioAsset) => void;
  onView: (asset: PortfolioAsset) => void;
  onDelete: (asset: PortfolioAsset) => void;
}) => ColumnDef<PortfolioAsset>[] = ({ onEdit, onView, onDelete }) => [
  {
    accessorKey: "thumbnail_url",
    header: "Preview",
    cell: ({ row }) => {
      const thumbnailUrl = row.original.thumbnail_url;
      const title = row.original.title;

      return (
        <div className="w-16 h-10 relative overflow-hidden rounded-md bg-muted flex items-center justify-center">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`Thumbnail for ${title}`}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="text-xs text-muted-foreground text-center p-1 leading-none">
              No Image
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title / Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("title")}
        <div className="text-sm text-muted-foreground">
          {/* Use snake_case key and capitalize it for display */}
          {row.original.asset_type?.toUpperCase() || "N/A"}
        </div>
      </div>
    ),
  },
  {
    // 🎯 FIX: Access the nested property within JSONB details
    accessorKey: "details.is_featured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.original.details?.is_featured;
      return (
        <Badge variant={isFeatured ? "default" : "secondary"}>
          {isFeatured ? "YES" : "NO"}
        </Badge>
      );
    },
  },
  {
    // 🎯 FIX: Use the snake_case key
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge
          className={
            isActive
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }
        >
          {isActive ? "Active" : "Draft"}
        </Badge>
      );
    },
  },
  // 3. Action Column
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
          title="Edit Asset"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(row.original)} // This line is now safe
          title="Delete Asset (Set Inactive)"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function AssetsDataTable({
  data,
  onEdit,
  onView,
  onDelete,
  isLoading, // 🎯 FIX: Added the missing prop here
}: AssetsDataTableProps) {
  // console.log("datababi:", data); // Removed console log
  // The 'onDelete' is correctly passed to assetColumns here
  const columns = assetColumns({ onEdit, onView, onDelete });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[{ id: "title", title: "Titles" }]}
      isLoading={isLoading} // 🎯 FIX: Pass isLoading state to the DataTable
    />
  );
}
