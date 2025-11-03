"use client";

import * as React from "react";

import { useEffect, useState } from "react";
import { Mail, Building2, Globe, Phone, FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import instance from "@/lib/axios";
import { toast } from "sonner";
import LoadingDialog from "./shared/LoadingDialog";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { useBusinesses } from "@/hooks/useBusinesses";
import { useBusinessContext } from "@/context/BusinessContext";
import { DialogClose } from "@/components/ui/dialog";

// Zod schema for form validation
const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  businessEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  businessPhoneNumber: z.string().min(1, {
    message: "Please enter a phone number.",
  }),
  businessAddress: z.string().min(5, {
    message: "Please enter a business address.",
  }),
  businessWebsite: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  businessLogo: z.instanceof(File, { message: "A logo file is required." }),
  isActive: z.boolean().default(true).optional(),
});

interface AddBusinessDialogProps {
  merchantId: number;
  children?: React.ReactNode;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function AddBusinessDialog({
  merchantId,
  children,
  onSuccess,
  open,
  onOpenChange,
}: AddBusinessDialogProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhoneNumber: "",
      businessAddress: "",
      businessWebsite: "",
      businessLogo: null as any, // Use `any` for the file type, or set to `null` to pass the zod schema
      isActive: true,
    },
  });
  const [loading, setLoading] = React.useState(false);
  const { businesses } = useBusinesses(merchantId);
  useState<any>(null);
  const { setBusinessId, businessId } = useBusinessContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  type FormValues = z.infer<typeof formSchema>;

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    // Clear previous errors before submitting
    form.clearErrors();

    try {
      const formData = new FormData();
      formData.append("businessName", values.businessName);
      formData.append("businessEmail", values.businessEmail);
      formData.append("businessPhoneNumber", values.businessPhoneNumber);
      formData.append("businessAddress", values.businessAddress);
      // formData.append("businessWebsite", values.businessWebsite);
      formData.append("isChurch", "false");
      formData.append("isActive", values.isActive ? "1" : "0");
      formData.append("businessLogo", values.businessLogo);

      const response = await instance.post(`/merchant/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          merchantId: merchantId,
        },
      });

      if (response.status === 201) {
        toast.success("Business created successfully!");

        // Use the response data to get the new businessId
        const newBusinessId = response.data.data.businessId;
        setBusinessId(response.data.data.businessId);
        // Refresh the page so TeamSwitcher sees the new business

        if (businesses.length === 0) {
          window.location.reload();
        }

        // This onSuccess is now just a callback, no longer awaiting a fetch
        if (onSuccess) {
          onSuccess();
        }

        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating business:", error);

      if (axios.isAxiosError(error) && error.response) {
        const backendMessage = error.response.data.message;

        if (backendMessage === "Business email already exists") {
          form.setError("businessEmail", {
            type: "manual",
            message: "This email is already registered.",
          });
          toast.error("This email is already registered.");
        } else if (backendMessage === "Business phone number already exists") {
          form.setError("businessPhoneNumber", {
            type: "manual",
            message: "This phone number is already registered.",
          });
          toast.error("This phone number is already registered.");
        } else {
          // Fallback for other errors
          console.error("Failed to create business. Please try again.");
        }
      } else {
        console.error("Failed to create business. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      onChange(null);
      setLogoPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[700px] p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
        onEscapeKeyDown={(e) => businesses.length === 0 && e.preventDefault()}
        onPointerDownOutside={(e) =>
          businesses.length === 0 && e.preventDefault()
        }
        hideClose={businesses.length === 0}
      >
        <DialogHeader>
          <DialogTitle>Add a New Business</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new business to your merchant
            account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Business Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Remit Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Business Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. contact@remit.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. +251-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Business Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Addis Ababa, Ethiopia"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Website (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. https://www.yourwebsite.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessLogo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileUp className="h-4 w-4" /> Business Logo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, onChange)}
                      />
                    </FormControl>
                    {logoPreview && (
                      <div className="mt-2">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-16 w-32 rounded shadow border"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="">
                Create Business
              </Button>
            </div>
          </form>
        </Form>
        <LoadingDialog open={loading} />
      </DialogContent>
    </Dialog>
  );
}
