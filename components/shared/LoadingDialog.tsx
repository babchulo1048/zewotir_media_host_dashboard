"use client";

interface LoadingDialogProps {
  open: boolean;
  message?: string;
}

export default function LoadingDialog({ open, message }: LoadingDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-800 dark:border-gray-200" />
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-200 text-center">
        {message || "Please wait..."}
      </p>
    </div>
  );
}
