// app/admin/blog/_components/PostFormDialog.tsx

"use client";

import { BlogPost } from "@/lib/models";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// NOTE: For the content field, you'd eventually use a rich text editor (like Tiptap or Slate)

interface PostFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  postToEdit?: BlogPost; // Optional prop
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  open,
  setOpen,
  postToEdit,
}) => {
  const isEditMode = !!postToEdit;

  const title = isEditMode
    ? `Edit Post: ${postToEdit.title}`
    : "Create New Blog Post";
  const buttonText = isEditMode ? "Save Changes" : "Create Post";

  const defaultPost: Partial<BlogPost> = {
    title: "",
    summary: "",
    content: "",
    status: "DRAFT",
    ...(postToEdit || {}),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Manage the content, image, and status of your blog post.
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
              defaultValue={defaultPost.title}
              className="col-span-4 md:col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="col-span-4 md:col-span-1">
              Slug (URL)
            </Label>
            <Input
              id="slug"
              defaultValue={
                defaultPost.slug ||
                defaultPost.title?.toLowerCase().replace(/\s/g, "-") ||
                ""
              }
              className="col-span-4 md:col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="summary" className="col-span-4 md:col-span-1">
              Summary
            </Label>
            <Textarea
              id="summary"
              defaultValue={defaultPost.summary}
              className="col-span-4 md:col-span-3"
              placeholder="A short description for SEO and previews."
            />
          </div>

          {/* This area would be a complex Rich Text Editor in a real app */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="col-span-4 md:col-span-1">
              Main Content
            </Label>
            <Textarea
              id="content"
              defaultValue={defaultPost.content}
              rows={8}
              className="col-span-4 md:col-span-3 font-mono"
              placeholder="The main body of your article..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="col-span-4 md:col-span-1">
              Header Image
            </Label>
            <Input
              id="imageUrl"
              type="file"
              className="col-span-4 md:col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="col-span-4 md:col-span-1">
              Status
            </Label>
            <Select defaultValue={defaultPost.status}>
              <SelectTrigger className="col-span-4 md:col-span-3">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT (Not Visible)</SelectItem>
                <SelectItem value="PUBLISHED">PUBLISHED (Live)</SelectItem>
                <SelectItem value="ARCHIVED">
                  ARCHIVED (Hidden from front-end)
                </SelectItem>
              </SelectContent>
            </Select>
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
