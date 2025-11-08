// app/admin/blog/_components/PostFormDialog.tsx

"use client";

import { useState, useRef } from "react"; // 👈 Import useState and useRef
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
import { Loader2 } from "lucide-react"; // 👈 Import Loader2

// Define the API endpoint
const API_URL = "http://localhost:3001/api/v1/blog/articles";

interface PostFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  postToEdit?: BlogPost;
  onSuccess: () => void; // 👈 New success callback prop
}

export const PostFormDialog: React.FC<PostFormDialogProps> = ({
  open,
  setOpen,
  postToEdit,
  onSuccess,
}) => {
  const isEditMode = !!postToEdit;
  const formRef = useRef<HTMLFormElement>(null); // 👈 Ref for the form
  const [isLoading, setIsLoading] = useState(false); // 👈 Loading state
  const [error, setError] = useState<string | null>(null); // 👈 Error state
  const [statusValue, setStatusValue] = useState<string>(
    postToEdit?.status || "DRAFT"
  );

  const title = isEditMode
    ? `Edit Post: ${postToEdit.title}`
    : "Create New Blog Post";
  const buttonText = isEditMode ? "Save Changes" : "Create Post";

  const defaultPost: Partial<BlogPost> = {
    title: "",
    summary: "",
    content: "",
    status: "DRAFT",
    // NOTE: This approach of spreading postToEdit directly into defaultPost is simplified.
    // In a real app, you'd manage form state with useState/useReducer and initial values.
    ...(postToEdit || {}),
  };

  // --- API SUBMISSION HANDLER ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formRef.current) return;

    // Create FormData object from the form
    const formData = new FormData(formRef.current);

    // Your API expects 'excerpt' not 'summary' based on your Postman payload
    const summary = formData.get("summary");
    if (summary) {
      formData.set("excerpt", summary); // Rename key
      formData.delete("summary");
    }

    // Convert keys to match your backend payload (e.g., 'title', 'content', 'featured_image')
    formData.set("category", "Uncategorized"); // Add a default category if not in form

    // Check if a new file was selected for upload
    const featuredImageFile = formData.get("imageUrl") as File;
    if (featuredImageFile && featuredImageFile.size > 0) {
      formData.set("featured_image", featuredImageFile);
    } else {
      formData.delete("imageUrl"); // Don't send empty file if in edit mode
      // For 'PUT' or 'PATCH', you usually send a flag if the image hasn't changed
    }

    // Set the method and URL based on CREATE or EDIT mode
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `${API_URL}/${postToEdit.id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        // When using FormData with a file upload, DO NOT set Content-Type header manually.
        // The browser handles the `multipart/form-data` and boundary automatically.
        body: formData,
      });

      if (!response.ok) {
        // Attempt to read error message from API response
        let errorMessage = "An unknown error occurred.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `API error: ${response.status}`;
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = `API error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Success! Call the onSuccess handler to close dialog and refresh list
      onSuccess();
    } catch (err) {
      console.error(isEditMode ? "Update failed:" : "Creation failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect to API."
      );
    } finally {
      setIsLoading(false);
    }
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
        <form onSubmit={handleSubmit} ref={formRef} className="grid gap-6 py-4">
          {error && (
            <div className="text-red-500 border border-red-500 p-3 rounded-md">
              **Error:** {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="col-span-4 md:col-span-1">
              Title
            </Label>
            <Input
              id="title"
              name="title" // 👈 Add name attribute for FormData
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
              name="slug" // 👈 Add name attribute
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
              Summary/Excerpt
            </Label>
            <Textarea
              id="summary"
              name="summary" // 👈 Add name attribute
              defaultValue={defaultPost.summary}
              className="col-span-4 md:col-span-3"
              placeholder="A short description for SEO and previews."
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="col-span-4 md:col-span-1">
              Main Content
            </Label>
            <Textarea
              id="content"
              name="content" // 👈 Add name attribute
              defaultValue={defaultPost.content}
              rows={8}
              className="col-span-4 md:col-span-3 font-mono"
              placeholder="The main body of your article..."
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="col-span-4 md:col-span-1">
              Header Image
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl" // 👈 Add name attribute. The backend expects 'featured_image'
              // We'll rename it in the handleSubmit to 'featured_image'
              type="file"
              className="col-span-4 md:col-span-3"
              // Only require file on create mode
              required={!isEditMode && !defaultPost.imageUrl}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="col-span-4 md:col-span-1">
              Status
            </Label>
            {/* The Select component doesn't use the `name` prop on the root, 
              so we'll use a hidden input or manually set a value in FormData.
              Here, we use a hidden input for simplicity. */}
            <Select
              defaultValue={defaultPost.status}
              onValueChange={setStatusValue}
            >
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
            <input type="hidden" name="status" value={statusValue} />{" "}
            {/* 👈 Hidden input for FormData */}
          </div>
          <input type="hidden" name="id" value={postToEdit?.id || ""} />{" "}
          {/* For PUT request identification */}
        </form>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
