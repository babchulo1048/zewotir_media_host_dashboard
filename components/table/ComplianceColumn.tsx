"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffSize, State, Industry, Currency } from "@/lib/models";
import { StaffSizeFormDialog } from "@/components/compliance/StaffSizeFormDialog";
import { IndustryFormDialog } from "@/components/compliance/IndustryFormDialog";
import { DeleteDialog } from "@/components/compliance/DeleteDialog";
import { useState } from "react";
import { toast } from "sonner";
import instance from "@/lib/axios";
import { StateFormDialog } from "@/components/compliance/StateFormDialog";
import { SubCityFormDialog } from "@/components/compliance/SubCityFormDialog";
import { CurrencyFormDialog } from "@/components/compliance/CurrencyFormDialog";

interface CommonColumnsProps {
  onSuccess: () => void;
}

export const StaffSizeColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<StaffSize>[] => [
  {
    accessorKey: "staffSizeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff Size Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const staffSize = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await instance.delete(
            `/compliance/staffsizes/${staffSize.staffSizeId}`
          );
          toast.success("Staff size deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete staff size:", error);
          toast.error("Failed to delete staff size. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <StaffSizeFormDialog staffSize={staffSize} onSuccess={onSuccess}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </StaffSizeFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the staff size. This action cannot be undone."
              isDeleting={isDeleting}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const StateColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<State>[] => [
  {
    accessorKey: "stateName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const state = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await instance.delete(`/compliance/states/${state.stateId}`);
          toast.success("State deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete state:", error);
          toast.error("Failed to delete state. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <StateFormDialog state={state} onSuccess={onSuccess}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </StateFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the state. This action cannot be undone."
              isDeleting={isDeleting}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const IndustryColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<Industry>[] => [
  {
    accessorKey: "industryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Industry Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const industry = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await instance.delete(
            `/compliance/industries/${industry.industryId}`
          );
          toast.success("Industry deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete industry:", error);
          toast.error("Failed to delete industry. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <IndustryFormDialog industry={industry} onSuccess={onSuccess}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </IndustryFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the industry. This action cannot be undone."
              isDeleting={isDeleting}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const SubCityColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<SubCity>[] => [
  {
    accessorKey: "subCityName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sub-city Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "stateName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.state?.stateName || "N/A",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subCity = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await instance.delete(`/compliance/sub-city/${subCity.subCityId}`);
          toast.success("Sub-city deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete sub-city:", error);
          toast.error("Failed to delete sub-city. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SubCityFormDialog subCity={subCity} onSuccess={onSuccess}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </SubCityFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the sub-city. This action cannot be undone."
              isDeleting={isDeleting}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const CurrencyColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<Currency>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "symbol",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleString()
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const currency = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          await instance.delete(`/currencies/${currency.id}`);
          toast.success("Currency deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete currency:", error);
          toast.error("Failed to delete currency. Please try again.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <CurrencyFormDialog currency={currency} onSuccess={onSuccess}>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </CurrencyFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the currency. This action cannot be undone."
              isDeleting={isDeleting}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
