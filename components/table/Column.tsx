"use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pencil,
  Trash2,
  ArrowRight,
  ArrowUpDown,
  MoreHorizontal,
  CircleCheck,
  CircleX,
  Clock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Transaction } from "@/lib/models";
import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import Link from "next/link";
import { TransactionDetailsDialog } from "@/app/dashboard/transactions/components/TransactionDetailsDialog";
import { Subaccount, Microfinance, Compliance, Customer } from "@/lib/models";

import { ComplianceDetailsDialog } from "@/components/ComplianceDetailsDialog";
import { MicrofinanceFormDialog } from "../microfinance/MicrofinanceFormDialog";
import { DeleteDialog } from "../compliance/DeleteDialog";
import { toast } from "sonner";
import instance from "@/lib/axios";

interface CommonColumnsProps {
  onSuccess: () => void;
}

export const CustomerColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role.name",
    header: "Role",
    cell: ({ row }) => row.original.role?.name || "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          // Static data for now: just toast
          toast.success(`Deleted customer ${customer.name}`);
          onSuccess();
        } catch (error) {
          console.error("Failed to delete customer:", error);
          toast.error("Failed to delete customer. Please try again.");
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
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-500"
              onSelect={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const MicrofinanceColumns = ({
  onSuccess,
}: CommonColumnsProps): ColumnDef<Microfinance>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "tinNumber",
    header: "TIN Number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "ownerName",
    header: "Owner Name",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const microfinance = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          // API: /admin/microfinance/${microfinanceData.id} (DELETE)
          await instance.delete(`/admin/microfinances/${microfinance.id}`);
          toast.success("Microfinance deleted successfully!");
          onSuccess();
        } catch (error) {
          console.error("Failed to delete microfinance:", error);
          toast.error("Failed to delete microfinance. Please try again.");
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
            <MicrofinanceFormDialog
              microfinance={microfinance}
              onSuccess={onSuccess}
            >
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </MicrofinanceFormDialog>
            <DeleteDialog
              onDelete={handleDelete}
              message="This will permanently delete the microfinance institution. This action cannot be undone."
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

interface SubaccountColumnsProps {
  onActionClick: (
    action: "edit" | "delete" | "transfer",
    subaccount: Subaccount
  ) => void;
}

export const SubaccountColumns = ({
  onActionClick,
}: SubaccountColumnsProps): ColumnDef<Subaccount>[] => [
  {
    accessorKey: "accountName",
    header: "Account Name",
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
  },
  {
    accessorKey: "bankName",
    header: "Bank",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "balance",
    header: "Balance",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subaccount = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            <DropdownMenuLabel className="text-xs px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => onActionClick("edit", subaccount)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Subaccount</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-500"
                    onClick={() => onActionClick("delete", subaccount)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Subaccount</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onClick={() => onActionClick("transfer", subaccount)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>Transfer</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transfer Funds</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const TransactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "txRef",
    header: "Transaction Reference",
  },
  // {
  //   accessorKey: "phone_number",
  //   header: "Phone Number",
  // },
  // {
  //   accessorKey: "business_phone",
  //   header: "Business Phone",
  // },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      row.original.amount !== undefined
        ? row.original.amount.toFixed(2)
        : "N/A",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      row.original.created_at
        ? new Date(row.original.created_at).toLocaleString()
        : "N/A",
  },
  // {
  //   accessorKey: "retry_count",
  //   header: "Retry Count",
  // },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            <DropdownMenuLabel className="text-xs px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <TransactionDetailsDialog
                transaction={transaction}
                onSuccess={() => location.reload()}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const ComplianceColumns: ColumnDef<Compliance>[] = [
  {
    accessorKey: "legalBusinessName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Business Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium">{row.original.legalBusinessName}</span>
      );
    },
  },
  {
    accessorKey: "merchant.email",
    header: "Merchant Email",
  },
  {
    accessorKey: "tinNumber",
    header: "TIN Number",
  },
  {
    accessorKey: "industry.industryName",
    header: "Industry",
  },
  {
    accessorKey: "state.stateName",
    header: "State",
  },
  {
    accessorKey: "approved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.approved;
      return (
        <div className="flex items-center gap-2">
          {status ? (
            <CircleCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Clock className="h-4 w-4 text-yellow-500" />
          )}
          <span className="font-medium">{status ? "Approved" : "Pending"}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const compliance = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 p-1">
            <DropdownMenuLabel className="text-xs px-2">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ComplianceDetailsDialog compliance={compliance} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
