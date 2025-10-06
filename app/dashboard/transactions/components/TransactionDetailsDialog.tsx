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
            <strong>Transaction Ref:</strong> <br /> {transaction.tx_ref}
          </div>
          <div>
            <strong>Phone Number:</strong> <br /> {transaction.phone_number}
          </div>
          <div>
            <strong>Business Phone:</strong> <br /> {transaction.business_phone}
          </div>
          <div>
            <strong>Amount:</strong> <br /> {transaction.amount.toFixed(2)}
          </div>
          <div>
            <strong>Payment Method:</strong> <br /> {transaction.payment_method}
          </div>
          <div>
            <strong>Status:</strong> <br /> {transaction.status}
          </div>
          <div>
            <strong>Retry Count:</strong> <br /> {transaction.retry_count}
          </div>
          <div>
            <strong>Created At:</strong> <br />{" "}
            {new Date(transaction.created_at).toLocaleString()}
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
