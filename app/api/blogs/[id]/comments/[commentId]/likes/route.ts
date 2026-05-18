/**
 * Comment Likes API
 * Handles liking and unliking blog comments
 * Route: /api/blogs/[id]/comments/[commentId]/likes
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import { CommentLike, ApiResponse, ApiErrorResponse } from "../../../../types";

interface CommentLikesStats {
  comment_id: string;
  total_likes: number;
  user_has_liked: boolean;
}

/**
 * GET /api/blogs/[id]/comments/[commentId]/likes
 * Retrieves like statistics for a comment
 * Query params:
 *   - include_user_status (optional): Check if current user has liked
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

    // Verify comment exists
    const { data: commentExists } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .select("id")
      .eq("id", commentId)
      .eq("blog_id", id)
      .single();

    if (!commentExists) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment not found", isError: true },
        { status: 404 }
      );
    }

    // Get total likes count
    const { count: totalLikes } = await supabase
      .schema("blogs")
      .from("comment_likes")
      .select("*", { count: "exact", head: true })
      .eq("comment_id", commentId);

    const { searchParams } = new URL(req.url);
    const includeUserStatus = searchParams.get("include_user_status") === "true";

    const response: CommentLikesStats = {
      comment_id: commentId,
      total_likes: totalLikes || 0,
      user_has_liked: false,
    };

    // Check if current user has liked
    if (includeUserStatus) {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { count: userLiked } = await supabase
          .schema("blogs")
          .from("comment_likes")
          .select("*", { count: "exact", head: true })
          .eq("comment_id", commentId)
          .eq("user_id", user.data.user.id);

        response.user_has_liked = (userLiked || 0) > 0;
      }
    }

    return NextResponse.json<ApiResponse<CommentLikesStats>>(
      { data: response, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to fetch comment likes", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blogs/[id]/comments/[commentId]/likes
 * Adds a like to a comment (requires authentication)
 */
export async function POST(
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
        { error: "Unauthorized - User not authenticated", isError: true },
        { status: 401 }
      );
    }

    // Verify comment exists
    const { data: commentExists } = await supabase
      .schema("blogs")
      .from("blog_comments")
      .select("id")
      .eq("id", commentId)
      .eq("blog_id", id)
      .eq("is_deleted", false)
      .single();

    if (!commentExists) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Comment not found", isError: true },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const { data: existingLike } = await supabase
      .schema("blogs")
      .from("comment_likes")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.data.user.id)
      .single();

    if (existingLike) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "User already liked this comment", isError: true },
        { status: 409 }
      );
    }

    // Create like
    const { data, error } = await supabase
      .schema("blogs")
      .from("comment_likes")
      .insert({
        comment_id: commentId,
        user_id: user.data.user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<CommentLike>>(
      { data, isError: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment like:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to like comment", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[id]/comments/[commentId]/likes
 * Removes a like from a comment (requires authentication)
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

    // Delete like
    const { data, error } = await supabase
      .schema("blogs")
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.data.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json<ApiErrorResponse>(
          { error: "Like not found", isError: true },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<CommentLike>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing comment like:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to remove comment like", isError: true, data: error },
      { status: 500 }
    );
  }
}
