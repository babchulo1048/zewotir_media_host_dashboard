// components/otp-form.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  email: string;
}

export default function OtpForm({ email }: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await instance.post("/auth/verify-otp-signin", {
        email,
        otp,
      });

      const { data } = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("merchantId", data.userId);
      router.push("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleOTPVerify}>
      <div className="text-center">
        <h2 className="text-xl font-bold">Enter OTP</h2>
        <p className="text-muted-foreground text-sm">
          We’ve sent a code to your email: {email}
        </p>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter your OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Verify OTP
      </Button>
    </form>
  );
}
