"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subaccount } from "@/lib/models";
import LoadingDialog from "@/components/shared/LoadingDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import instance from "@/lib/axios";

interface TransferSubaccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subaccount: Subaccount;
  onSuccess: () => void;
}

const TransferSubaccountDialog = ({
  open,
  onOpenChange,
  subaccount,
  onSuccess,
}: TransferSubaccountDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: OTP sent state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Amount and destination account state
  const [amount, setAmount] = useState<string>("");
  console.log("subaccount", subaccount);

  // Send OTP handler
  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await instance.post("/subaccounts/transfer/send-otp", {
        subaccountId: subaccount?.id,
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP & transfer handler
  const verifyOtpAndTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!otp) {
      setError("Please enter the OTP sent to your phone.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await instance.post("/subaccounts/transfer/verify-otp", {
        subaccountId: subaccount?.id,
        amount,
        otp,
      });
      onSuccess();
      onOpenChange(false);
      // Reset state for next time
      setOtpSent(false);
      setAmount("");
      setOtp("");
    } catch (err: any) {
      console.log("first error", err.response?.data?.message || err.message);
      // setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Transfer Funds
            </DialogTitle>
            <DialogDescription>
              Transfer from subaccount: <b>{subaccount.accountName}</b> (Account
              Number: {subaccount.accountNumber}).
            </DialogDescription>
          </DialogHeader>

          {!otpSent ? (
            <div className="py-4">
              <Button onClick={sendOtp} disabled={loading}>
                Send OTP
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyOtpAndTransfer();
              }}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otp" className="text-right">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="col-span-3"
                  maxLength={6}
                  placeholder="Enter OTP"
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    setOtpSent(false);
                    setAmount("");
                    setOtp("");
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Verify & Transfer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <LoadingDialog
        open={loading}
        message={otpSent ? "Verifying OTP..." : "Sending OTP..."}
      />
    </>
  );
};

export default TransferSubaccountDialog;
