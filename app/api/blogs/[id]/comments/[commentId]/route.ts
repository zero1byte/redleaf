/**
 * Individual Blog Comment Operations API
 * Handles update and delete for specific comments
 * Route: /api/blogs/[id]/comments/[commentId]
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { BlogComment, UpdateCommentPayload, ApiResponse, ApiErrorResponse } from "../../../types";

/**
 * GET /api/blogs/[id]/comments/[commentId]
 * Retrieves a specific comment
 */
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  const { id, commentId } = await params;
  const supabase = createClientBackend();

  try {
    if (!id || !commentId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID and Comment ID are required", isError: true },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .select("*")
      .eq("id", commentId)
      .eq("blog_id", id)
      .eq("is_deleted", false)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json<ApiErrorResponse>(
          { error: "Comment not found", isError: true },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogComment>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to fetch comment", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blogs/[id]/comments/[commentId]
 * Updates a specific comment (only by author)
 * Request body:
 *   - content (required): Updated comment text
 */
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  const { id, commentId } = await params;
  const supabase = await createClient();

  try {
    if (!id || !commentId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID and Comment ID are required", isError: true },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Unauthorized", isError: true },
        { status: 401 }
      );
    }

    const payload: UpdateCommentPayload = await req.json();

    // Validate payload
    if (!payload.content || payload.content.trim().length === 0) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment content is required", isError: true },
        { status: 400 }
      );
    }

    if (payload.content.length > 5000) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment content cannot exceed 5000 characters", isError: true },
        { status: 400 }
      );
    }

    // Get existing comment to verify ownership
    const { data: existingComment, error: fetchError } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .select("user_id")
      .eq("id", commentId)
      .eq("blog_id", id)
      .single();

    if (fetchError || !existingComment) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment not found", isError: true },
        { status: 404 }
      );
    }

    // Verify user is the author
    if (existingComment.user_id !== user.data.user.id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Unauthorized - You can only edit your own comments", isError: true },
        { status: 403 }
      );
    }

    // Update comment
    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .update({
        content: payload.content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .eq("blog_id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogComment>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to update comment", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[id]/comments/[commentId]
 * Soft deletes a comment (only by author or blog owner)
 */
export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; commentId: string }>;
  }
) {
  const { id, commentId } = await params;
  const supabase = await createClient();

  try {
    if (!id || !commentId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID and Comment ID are required", isError: true },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Unauthorized", isError: true },
        { status: 401 }
      );
    }

    // Get comment to verify ownership and blog author
    const { data: comment, error: commentError } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .select("user_id")
      .eq("id", commentId)
      .eq("blog_id", id)
      .single();

    if (commentError || !comment) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment not found", isError: true },
        { status: 404 }
      );
    }

    // Get blog author to verify deletion rights
    const { data: blog, error: blogError } = await supabase
      .schema("blogs")
      .from("blogs")
      .select("author_id")
      .eq("id", id)
      .single();

    if (blogError || !blog) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog not found", isError: true },
        { status: 404 }
      );
    }

    // Verify user is either comment author or blog owner
    const isCommentAuthor = comment.user_id === user.data.user.id;
    const isBlogOwner = blog.author_id === user.data.user.id;

    if (!isCommentAuthor && !isBlogOwner) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error:
            "Unauthorized - You can only delete your own comments or as blog owner",
          isError: true,
        },
        { status: 403 }
      );
    }

    // Soft delete comment
    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .update({ is_deleted: true })
      .eq("id", commentId)
      .eq("blog_id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogComment>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to delete comment", isError: true, data: error },
      { status: 500 }
    );
  }
}
