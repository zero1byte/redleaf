/**
 * Blog Likes API
 * Handles liking and unliking blogs
 * Route: /api/blogs/[id]/likes
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import {
  BlogLikesStats,
  BlogLike,
  ApiResponse,
  ApiErrorResponse,
} from "../../types";

/**
 * GET /api/blogs/[id]/likes
 * Retrieves like statistics for a blog
 * Query params:
 *   - include_recent_likers (optional): Include list of recent likers
 *   - include_user_status (optional): Check if current user has liked (requires auth)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClientBackend();

  try {
    if (!id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID is required", isError: true },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const includeRecentLikers =
      searchParams.get("include_recent_likers") === "true";
    const includeUserStatus = searchParams.get("include_user_status") === "true";

    // Get total likes count
    const { count: totalLikes, error: countError } = await supabase
      .schema("blogs")
      .from("blog_likes")
      .select("*", { count: "exact", head: true })
      .eq("blog_id", id);

    if (countError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: countError.message, isError: true, data: countError },
        { status: 500 }
      );
    }

    const response: BlogLikesStats = {
      blog_id: id,
      total_likes: totalLikes || 0,
      user_has_liked: false,
    };

    // Check if current user has liked (if authenticated)
    if (includeUserStatus) {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { count: userLiked } = await supabase
          .schema("blogs")
          .from("blog_likes")
          .select("*", { count: "exact", head: true })
          .eq("blog_id", id)
          .eq("user_id", user.data.user.id);

        response.user_has_liked = (userLiked || 0) > 0;
      }
    }

    // Get recent likers if requested
    if (includeRecentLikers) {
      const { data: recentLikes, error: likesError } = await supabase
        .schema("blogs")
        .from("blog_likes")
        .select("user_id")
        .eq("blog_id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!likesError && recentLikes) {
        // Note: You may need to join with users table to get username and avatar
        response.recent_likers = recentLikes.map((like) => ({
          user_id: like.user_id,
          username: "", // Populate from users table if available
          avatar_url: "",
        }));
      }
    }

    return NextResponse.json<ApiResponse<BlogLikesStats>>(
      { data: response, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to fetch likes", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blogs/[id]/likes
 * Adds a like to a blog (requires authentication)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    if (!id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID is required", isError: true },
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

    // Verify blog exists
    const { data: blogExists, error: blogError } = await supabase
      .schema("blogs")
      .from("blogs")
      .select("id")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (blogError || !blogExists) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog not found", isError: true },
        { status: 404 }
      );
    }

    // Check if user already liked this blog
    const { data: existingLike } = await supabase
      .schema("blogs")
      .from("blog_likes")
      .select("id")
      .eq("blog_id", id)
      .eq("user_id", user.data.user.id)
      .single();

    if (existingLike) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "User already liked this blog", isError: true },
        { status: 409 }
      );
    }

    // Create like
    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_likes")
      .insert({
        blog_id: id,
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

    return NextResponse.json<ApiResponse<BlogLike>>(
      { data, isError: false },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating like:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to like blog", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[id]/likes
 * Removes a like from a blog (requires authentication)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    if (!id) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Blog ID is required", isError: true },
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
      .from("blog_likes")
      .delete()
      .eq("blog_id", id)
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

    return NextResponse.json<ApiResponse<BlogLike>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to remove like", isError: true, data: error },
      { status: 500 }
    );
  }
}
