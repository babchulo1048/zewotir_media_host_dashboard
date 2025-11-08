// app/admin/blog/_components/PostViewDialog.tsx

"use client";

import { BlogPost } from "@/lib/models"; // Assuming 'BlogPost' is now 'any' or updated
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface PostViewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  post?: any; // 👈 Update to 'any' or the new model structure
}

export const PostViewDialog: React.FC<PostViewDialogProps> = ({
  open,
  setOpen,
  post,
}) => {
  // Guard clause: if no post is provided, don't show the content
  if (!post) return null;

  // --- MAPPING NEW API FIELDS ---
  const imageUrl = post.featured_image_url;
  const summary = post.excerpt;
  const createdAt = post.created_at;
  const postId = post.id;

  // These fields are likely missing and we'll use sensible defaults/fallbacks
  const status = post.status || "UNKNOWN";
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "Not Available";
  const tags = post.tags || [];
  const content =
    post.content ||
    "Content preview not available in the current API response.";

  // Helper function for status badge color (Keeping old logic for display, defaulting UNKNOWN)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">PUBLISHED</Badge>
        );
      case "DRAFT":
        return <Badge variant="secondary">DRAFT</Badge>;
      case "ARCHIVED":
        return <Badge variant="destructive">ARCHIVED</Badge>;
      case "UNKNOWN":
      default:
        return <Badge variant="outline">UNKNOWN/DEFAULT</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl md:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>👀 View Post: **{post.title}**</DialogTitle>
          <DialogDescription>
            Read-only preview of the blog post content and metadata.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-6 pt-4">
          {/* --- Left Column: Metadata & Image (Span 2) --- */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Featured Image
            </h3>
            <div className="w-full h-48 relative rounded-lg border overflow-hidden bg-muted">
              {/* Check if image URL exists before rendering */}
              {imageUrl ? (
                <img
                  src={imageUrl} // 👈 Use featured_image_url
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Featured Image
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold border-b pb-1">
              Post Details
            </h3>

            {/* Display Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Category
              </Label>
              <Badge variant="default">{post.category}</Badge>
            </div>

            {/* Display Status (Using fallback) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              {getStatusBadge(status)}
            </div>

            {/* Published Date (Using fallback) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Published Date
              </Label>
              <p className="font-medium">{publishedDate}</p>
            </div>

            {/* Tags (Using fallback) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Tags
              </Label>
              <div className="flex flex-wrap gap-1">
                {tags.length > 0 ? (
                  tags.map(
                    (
                      tag: string // Cast tag to string
                    ) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    No tags
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-xs text-muted-foreground">
              {/* Use created_at field */}
              <p>Created At: **{new Date(createdAt).toLocaleDateString()}**</p>
              {/* Author ID is missing */}
              <p className="truncate">Post ID: {postId}</p>
            </div>
          </div>

          {/* --- Right Column: Content (Span 3) --- */}
          <div className="md:col-span-3 space-y-4 border-l pl-6">
            <h2 className="text-xl font-bold">{post.title}</h2>

            {/* Use excerpt field */}
            <div className="text-sm text-muted-foreground italic border-l-4 border-primary/50 pl-3">
              {summary}
            </div>

            <Separator />

            <div className="text-base leading-relaxed whitespace-pre-wrap">
              <Label className="text-sm font-medium text-muted-foreground block mb-2">
                Full Content Preview (Raw)
              </Label>
              {/* Use content field (with fallback) */}
              <p className="border p-4 rounded-md bg-secondary/10 text-sm font-mono max-h-96 overflow-y-auto">
                {content}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
