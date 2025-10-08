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
import { Transaction } from "@/lib/models";

interface TransactionDetailsDialogProps {
  transaction: Transaction;
  onSuccess: () => void;
}

export function TransactionDetailsDialog({
  transaction,
  onSuccess,
}: TransactionDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  console.log("transaction:", transaction);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl space-y-4">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <section className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <strong>Transaction Ref:</strong> <br /> {transaction.txRef}
          </div>
          <div>
            <strong>CustomerId:</strong> <br />{" "}
            {transaction.metadata.customerId}
          </div>
          <div>
            <strong>Transaction Type:</strong> <br />{" "}
            {transaction.transactionType}
          </div>
          <div>
            <strong>Amount:</strong> <br /> {transaction.amount.toFixed(2)}
          </div>
          <div>
            <strong>Payment Method:</strong> <br /> {transaction.paymentMethod}
          </div>
          <div>
            <strong>Status:</strong> <br /> {transaction.status}
          </div>
          {/* <div>
            <strong>Retry Count:</strong> <br /> {transaction.retry_count}
          </div> */}
          <div>
            <strong>Created At:</strong> <br />{" "}
            {new Date(transaction.createdAt).toLocaleString()}
          </div>
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
