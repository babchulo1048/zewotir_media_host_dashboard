"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import instance from "@/lib/axios";
import OtpForm from "@/components/otp-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("adminpass");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      router.push("/");
      const response = await axios.post(
        "http://127.0.0.1:9090/api/v1/auth/admin/signin",
        {
          emailOrPhoneNumber: email,
          password,
        }
      );
      console.log("first:", response.data.data);

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userId", response.data.data.id);
      localStorage.setItem("userName", response.data.data.displayName);
      // if (response.data.microfinanceName) {
      //   localStorage.setItem(
      //     "microfinanceName",
      //     response.data.microfinanceName
      //   );
      // }
      router.push("/");
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data.message || "Login failed");
      } else {
        console.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    try {
      await instance.post("/auth/forgot-password", {
        email: forgotPasswordEmail,
      });
      setShowResetForm(true);
      toast.success("Password reset OTP sent to your email!");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to send OTP.");
      } else {
        toast.error("Network error");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);
    try {
      await instance.post("/auth/reset-password", {
        email: forgotPasswordEmail,
        token: resetToken,
        newPassword: newPassword,
      });
      toast.success("Password updated successfully! You can now log in.");
      setIsForgotPasswordOpen(false);
      setShowResetForm(false);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to reset password.");
      } else {
        toast.error("Network error");
      }
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                {requires2FA ? (
                  <OtpForm email={email} />
                ) : (
                  <form className="p-6 md:p-8" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Welcome back</h1>
                        <p className="text-muted-foreground text-balance">
                          Login to your Acme Inc account
                        </p>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. m@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <Dialog
                            open={isForgotPasswordOpen}
                            onOpenChange={setIsForgotPasswordOpen}
                          >
                            <DialogTrigger asChild>
                              <a
                                href="#"
                                className="ml-auto text-sm underline-offset-2 hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsForgotPasswordOpen(true);
                                }}
                              >
                                Forgot your password?
                              </a>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Forgot Password</DialogTitle>
                                <DialogDescription>
                                  {showResetForm
                                    ? "Enter the OTP from your email and a new password."
                                    : "Enter your email to receive a password reset token."}
                                </DialogDescription>
                              </DialogHeader>
                              {!showResetForm ? (
                                <form onSubmit={handleForgotPassword}>
                                  <div className="grid gap-4 py-4">
                                    <Label htmlFor="forgot-email">Email</Label>
                                    <Input
                                      id="forgot-email"
                                      type="email"
                                      value={forgotPasswordEmail}
                                      onChange={(e) =>
                                        setForgotPasswordEmail(e.target.value)
                                      }
                                      required
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      disabled={isSendingOtp}
                                    >
                                      {isSendingOtp && (
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Send OTP
                                    </Button>
                                  </DialogFooter>
                                </form>
                              ) : (
                                <form onSubmit={handleResetPassword}>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="token">OTP</Label>
                                      <Input
                                        id="token"
                                        type="text"
                                        value={resetToken}
                                        onChange={(e) =>
                                          setResetToken(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="new-password">
                                        New Password
                                      </Label>
                                      <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                          setNewPassword(e.target.value)
                                        }
                                        required
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      disabled={isResettingPassword}
                                    >
                                      {isResettingPassword && (
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                      )}
                                      Reset Password
                                    </Button>
                                  </DialogFooter>
                                </form>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                        variant={loading ? "secondary" : "default"}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>

                      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                          Or continue with
                        </span>
                      </div>
                      {/* <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <a
                          href="/auth/register"
                          className="underline underline-offset-4"
                        >
                          Sign up
                        </a>
                      </div> */}
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
