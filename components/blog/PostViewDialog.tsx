// app/admin/blog/_components/PostViewDialog.tsx

"use client";

import { BlogPost } from "@/lib/models";
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
  post?: BlogPost; // The post to display
}

export const PostViewDialog: React.FC<PostViewDialogProps> = ({
  open,
  setOpen,
  post,
}) => {
  // Guard clause: if no post is provided, don't show the content
  if (!post) return null;

  // Helper to format the publish date
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : "Not Published Yet";

  // Helper function for status badge color
  const getStatusBadge = (status: BlogPost["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">PUBLISHED</Badge>
        );
      case "DRAFT":
        return <Badge variant="secondary">DRAFT</Badge>;
      case "ARCHIVED":
        return <Badge variant="destructive">ARCHIVED</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
              {/* Image Placeholder */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold border-b pb-1">
              Post Details
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              {getStatusBadge(post.status)}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Published Date
              </Label>
              <p className="font-medium">{publishedDate}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Tags
              </Label>
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Created At: **{new Date(post.createdAt).toLocaleDateString()}**
              </p>
              <p className="truncate">Author ID: {post.authorId}</p>
              <p className="truncate">Post ID: {post.id}</p>
            </div>
          </div>

          {/* --- Right Column: Content (Span 3) --- */}
          <div className="md:col-span-3 space-y-4 border-l pl-6">
            <h2 className="text-xl font-bold">{post.title}</h2>

            <div className="text-sm text-muted-foreground italic border-l-4 border-primary/50 pl-3">
              {post.summary}
            </div>

            <Separator />

            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {/* NOTE: In a real application, the content field would be rendered 
                using a Markdown parser or a Rich Text viewer here.
                For static data, we show the raw content.
                */}
              <Label className="text-sm font-medium text-muted-foreground block mb-2">
                Full Content Preview (Raw)
              </Label>
              <p className="border p-4 rounded-md bg-secondary/10 text-sm font-mono max-h-96 overflow-y-auto">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
