"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Currency } from "@/lib/models";
import { toast } from "sonner";
import instance from "@/lib/axios";

interface CurrencyFormDialogProps {
  children: React.ReactNode;
  currency?: Currency;
  onSuccess: () => void;
}

export function CurrencyFormDialog({
  children,
  currency,
  onSuccess,
}: CurrencyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState(currency ? currency.code : "");
  const [name, setName] = useState(currency ? currency.name : "");
  const [symbol, setSymbol] = useState(currency ? currency.symbol : "");

  useEffect(() => {
    if (currency) {
      setCode(currency.code);
      setName(currency.name);
      setSymbol(currency.symbol);
    }
  }, [currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !symbol) {
      toast.error("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (currency) {
        // Update existing currency
        await instance.put(`/currencies/${currency.id}`, {
          code,
          name,
          symbol,
        });
        toast.success("Currency updated successfully!");
      } else {
        // Create new currency
        await instance.post("/currencies", {
          code,
          name,
          symbol,
        });
        toast.success("Currency added successfully!");
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save currency:", error);
      toast.error("Failed to save currency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currency ? "Edit Currency" : "Add Currency"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., ETB"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ethiopian Birr"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., birr"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? currency
                  ? "Updating..."
                  : "Adding..."
                : currency
                ? "Update"
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
