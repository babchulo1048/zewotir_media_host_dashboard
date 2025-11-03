// app/admin/resumes/_components/ResumeFormDialog.tsx

"use client";

import { ResumeDocument } from "@/lib/models";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ResumeFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  documentToEdit?: ResumeDocument;
}

export const ResumeFormDialog: React.FC<ResumeFormDialogProps> = ({
  open,
  setOpen,
  documentToEdit,
}) => {
  const isEditMode = !!documentToEdit;

  const title = isEditMode
    ? `Edit Document: ${documentToEdit.title}`
    : "Upload New Resume Document";
  const buttonText = isEditMode ? "Save Changes" : "Upload & Create";

  const defaultDoc: Partial<ResumeDocument> = {
    title: "",
    version: "",
    status: "DRAFT",
    isPrimary: false,
    ...(documentToEdit || {}),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update metadata for document: ${documentToEdit?.id}`
              : "Upload a new PDF or DOCX file and fill in its metadata."}
          </DialogDescription>
        </DialogHeader>

        {/* --- FORM LAYOUT --- */}
        <form className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="col-span-4 md:col-span-1">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={defaultDoc.title}
              className="col-span-4 md:col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="version" className="col-span-4 md:col-span-1">
              Version
            </Label>
            <Input
              id="version"
              defaultValue={defaultDoc.version}
              className="col-span-4 md:col-span-3"
              placeholder="e.g., v2.1 - Technical, v1.0 - General"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentUrl" className="col-span-4 md:col-span-1">
              {isEditMode ? "Change File" : "Upload File (.pdf, .docx)"}
            </Label>
            <Input
              id="documentUrl"
              type="file"
              className="col-span-4 md:col-span-3"
              accept=".pdf,.docx"
              required={!isEditMode}
            />
            {isEditMode && (
              <div className="col-start-2 col-span-3 text-xs text-muted-foreground">
                Current File:{" "}
                <a
                  href={documentToEdit?.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline truncate"
                >
                  {documentToEdit?.documentUrl}
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
            <Label htmlFor="status" className="col-span-4 md:col-span-1">
              Status
            </Label>
            <Select defaultValue={defaultDoc.status}>
              <SelectTrigger className="col-span-4 md:col-span-3">
                <SelectValue placeholder="Select Document Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT (Hidden)</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE (Public Link)</SelectItem>
                <SelectItem value="ARCHIVED">ARCHIVED (Historical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 md:col-start-2 md:col-span-3 flex items-center space-x-2">
              <Switch id="isPrimary" defaultChecked={defaultDoc.isPrimary} />
              <Label htmlFor="isPrimary">
                Set as **Primary** Resume (Main link)
              </Label>
            </div>
          </div>
        </form>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
