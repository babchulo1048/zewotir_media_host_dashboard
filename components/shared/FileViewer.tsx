"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export function FileViewer({ isOpen, onClose, fileUrl, fileName }: FileViewerProps) {
  // detect file type
  const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(fileUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-full rounded"
              title={fileName}
            />
          ) : isImage ? (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-h-full max-w-full mx-auto rounded shadow"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Preview not available.</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <Button variant="outline">Download File</Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
