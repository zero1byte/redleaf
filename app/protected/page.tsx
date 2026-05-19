"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  title: string;
  subTitle: string | null;
  contents: string;
  banner_image: string | null;
  created_at: string;
  is_draft: boolean;
}

export default function ProtectedPage() {
  const [draftedBlogs, setDraftedBlogs] = useState<Blog[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/blogs/user");
        const { data, isError } = response.data;

        if (isError) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          setError("Failed to load blogs");
          return;
        }

        setDraftedBlogs(data.drafted || []);
        setPublishedBlogs(data.published || []);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError("Failed to load your blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [router]);

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await axios.delete(`/api/blogs/user?id=${blogId}`);
      if (!response.data.isError) {
        setDraftedBlogs(prev => prev.filter(blog => blog.id !== blogId));
        setPublishedBlogs(prev => prev.filter(blog => blog.id !== blogId));
      } else {
        setError("Failed to delete the blog. Please try again.");
      }
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      setError(err.response?.data?.error || "Failed to delete the blog");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, words: number = 30) => {
    const wordArray = content.split(/\s+/).slice(0, words);
    return wordArray.join(" ") + (wordArray.length >= words ? "..." : "");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Blogs</h1>
            <p className="text-muted-foreground mt-2">Manage your drafted and published blogs</p>
          </div>
          <Link href="/protected/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Blog
            </Button>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Drafted Blogs Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Drafts ({draftedBlogs.length})
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Unpublished blogs you're still working on</p>
          </div>

          {draftedBlogs.length === 0 ? (
            <div className="p-8 rounded-lg border border-border/50 bg-muted/30 text-center">
              <p className="text-muted-foreground">No drafts yet. Start creating!</p>
              <Link href="/protected/new" className="text-primary hover:underline mt-2 inline-block">
                Create your first draft
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftedBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="group rounded-lg border border-border/50 bg-card hover:border-primary/50 overflow-hidden transition-all duration-200 flex flex-col"
                >
                  {/* Banner Image */}
                  {blog.banner_image && (
                    <div className="h-40 overflow-hidden bg-muted">
                      <img
                        src={blog.banner_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    {blog.subTitle && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {blog.subTitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                      {truncateContent(blog.contents, 20)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {formatDate(blog.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 p-4 border-t border-border/50 bg-muted/30">
                    <button
                      onClick={() => router.push(`/protected/new?id=${blog.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Blogs Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Published ({publishedBlogs.length})
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Blogs that are live and visible to everyone</p>
          </div>

          {publishedBlogs.length === 0 ? (
            <div className="p-8 rounded-lg border border-border/50 bg-muted/30 text-center">
              <p className="text-muted-foreground">No published blogs yet. Publish your first blog!</p>
              <Link href="/protected/new" className="text-primary hover:underline mt-2 inline-block">
                Create and publish a blog
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publishedBlogs.map(blog => (
                <div
                  key={blog.id}
                  className="group rounded-lg border border-border/50 bg-card hover:border-primary/50 overflow-hidden transition-all duration-200 flex flex-col"
                >
                  {/* Banner Image */}
                  {blog.banner_image && (
                    <div className="h-40 overflow-hidden bg-muted">
                      <img
                        src={blog.banner_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                    {blog.subTitle && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {blog.subTitle}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                      {truncateContent(blog.contents, 20)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {formatDate(blog.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 p-4 border-t border-border/50 bg-muted/30">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
