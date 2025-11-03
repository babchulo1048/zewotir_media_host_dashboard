// app/admin/blog/page.tsx

"use client";

import { useState } from "react";
import { PlusCircle, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { STATIC_BLOG_POSTS } from "@/lib/blog-posts";
import { BlogPost } from "@/lib/models";

// --- Import Placeholder Components (You will create these) ---
import { PostsDataTable } from "@/components/blog/PostsDataTable";
import { PostFormDialog } from "@/components/blog/PostFormDialog";

import { PostViewDialog } from "@/components/blog/PostViewDialog";

export default function BlogPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(
    undefined
  );

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<BlogPost | undefined>(
    undefined
  );

  // Handler to open the dialog for creating a NEW post
  const handleCreate = () => {
    setEditingPost(undefined); // Clear any old editing data
    setIsDialogOpen(true);
  };

  // Handler to open the dialog for editing an existing post
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post); // Set the post data to pre-fill the form
    setIsDialogOpen(true);
  };

  // Handler for viewing details (can reuse a simple dialog or console log for now)
  const handleView = (post: BlogPost) => {
    setViewingPost(post); // Set the post data to be displayed
    setIsViewDialogOpen(true); // Open the view modal
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Newspaper className="h-7 w-7" />
          Blog Post Manager
        </h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      {/* Reusable Dialog Component for CREATE/EDIT */}
      <PostFormDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        postToEdit={editingPost} // undefined for create, object for edit
      />

      <PostViewDialog
        open={isViewDialogOpen}
        setOpen={setIsViewDialogOpen}
        post={viewingPost} // Pass the post currently selected for viewing
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            All Blog Posts ({STATIC_BLOG_POSTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Render the DataTable with the static data */}
          <PostsDataTable
            data={STATIC_BLOG_POSTS}
            onEdit={handleEdit}
            onView={handleView}
          />
        </CardContent>
      </Card>
    </main>
  );
}
