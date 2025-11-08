// app/admin/blog/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react"; // 👈 Import useEffect and useCallback
import { PlusCircle, Newspaper, Loader2 } from "lucide-react"; // 👈 Import Loader2
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// REMOVE: import { STATIC_BLOG_POSTS } from "@/lib/blog-posts"; // 👈 Remove static import
import { BlogPost } from "@/lib/models";

// --- Import Placeholder Components ---
import { PostsDataTable } from "@/components/blog/PostsDataTable";
import { PostFormDialog } from "@/components/blog/PostFormDialog";
import { PostViewDialog } from "@/components/blog/PostViewDialog";

// Define your API endpoint
// const API_URL = "http://localhost:3001/api/v1/blog/articles"; // 👈 Define the API URL
const API_URL =
  "https://zewotir-media-host-backend.onrender.com/api/v1/blog/articles";
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]); // 👈 New state for dynamic posts
  const [isLoading, setIsLoading] = useState(true); // 👈 New state for loading
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(
    undefined
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<BlogPost | undefined>(
    undefined
  );

  // Function to fetch posts from the API
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      // Assuming your API returns an array of BlogPost objects directly
      const data: BlogPost[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // You might want to display a toast/alert here
      setPosts([]); // Clear posts on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means it's created once

  useEffect(() => {
    fetchPosts(); // Fetch data when the component mounts
  }, [fetchPosts]);

  // Handler for successful post creation/update
  const handleSuccess = () => {
    setIsDialogOpen(false); // Close the dialog
    setEditingPost(undefined);
    fetchPosts(); // Re-fetch the posts list to update the table
  };

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

  // Handler for viewing details
  const handleView = (post: BlogPost) => {
    setViewingPost(post);
    setIsViewDialogOpen(true);
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
        postToEdit={editingPost}
        onSuccess={handleSuccess} // 👈 Pass the success handler
      />

      <PostViewDialog
        open={isViewDialogOpen}
        setOpen={setIsViewDialogOpen}
        post={viewingPost}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            All Blog Posts ({isLoading ? "..." : posts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-lg">Loading posts...</span>
            </div>
          ) : (
            // Render the DataTable with the DYNAMIC data
            <PostsDataTable
              data={posts} // 👈 Use dynamic data
              onEdit={handleEdit}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
