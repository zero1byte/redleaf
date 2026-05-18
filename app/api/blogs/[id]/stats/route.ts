/**
 * Blog Stats API
 * Handles blog statistics: views, ratings, and share counts
 * Route: /api/blogs/[id]/stats
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import {
  BlogStatsResponse,
  BlogStatsUpdatePayload,
  ApiResponse,
  ApiErrorResponse,
} from "../../types";

/**
 * GET /api/blogs/[id]/stats
 * Retrieves statistics for a specific blog
 * Query params:
 *   - include_trends (optional): Include trend data
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

    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_stats")
      .select("*")
      .eq("blog_id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json<ApiErrorResponse>(
          { error: "Stats not found for this blog", isError: true },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogStatsResponse>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to fetch blog statistics", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blogs/[id]/stats
 * Updates blog statistics (views, rating, share count)
 * Request body:
 *   - views (optional): Increment view count
 *   - rating (optional): Update rating
 *   - share_count (optional): Increment share count
 */
export async function PUT(
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

    // Verify user is authenticated for critical operations
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Unauthorized", isError: true },
        { status: 401 }
      );
    }

    const payload: BlogStatsUpdatePayload = await req.json();

    // Validate payload
    if (
      typeof payload.views !== "number" &&
      typeof payload.rating !== "number" &&
      typeof payload.share_count !== "number"
    ) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error:
            "At least one of views, rating, or share_count must be provided",
          isError: true,
        },
        { status: 400 }
      );
    }

    // Validate ranges
    if (payload.views !== undefined && payload.views < 0) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Views must be non-negative", isError: true },
        { status: 400 }
      );
    }

    if (payload.rating !== undefined && (payload.rating < 0 || payload.rating > 5)) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Rating must be between 0 and 5", isError: true },
        { status: 400 }
      );
    }

    if (payload.share_count !== undefined && payload.share_count < 0) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Share count must be non-negative", isError: true },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (payload.views !== undefined) updateData.views = payload.views;
    if (payload.rating !== undefined) updateData.rating = payload.rating;
    if (payload.share_count !== undefined) updateData.share_count = payload.share_count;

    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_stats")
      .update(updateData)
      .eq("blog_id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json<ApiErrorResponse>(
          { error: "Stats not found for this blog", isError: true },
          { status: 404 }
        );
      }
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogStatsResponse>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog stats:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to update blog statistics", isError: true, data: error },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blogs/[id]/stats
 * Increments blog statistics (for views tracking)
 * Request body:
 *   - increment_views (optional): Number to increment views by (default 1)
 *   - increment_shares (optional): Number to increment share_count by (default 1)
 */
export async function PATCH(
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

    const { increment_views = 1, increment_shares = 0 } = await req.json();

    if (increment_views < 0 || increment_shares < 0) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Increment values must be non-negative", isError: true },
        { status: 400 }
      );
    }

    // First get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .schema("blogs")
      .from("blog_stats")
      .select("views, share_count")
      .eq("blog_id", id)
      .single();

    if (fetchError) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Stats not found for this blog", isError: true },
        { status: 404 }
      );
    }

    // Update with incremented values
    const { data, error } = await supabase
      .schema("blogs")
      .from("blog_stats")
      .update({
        views: (currentStats.views || 0) + increment_views,
        share_count: (currentStats.share_count || 0) + increment_shares,
      })
      .eq("blog_id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: error.message, isError: true, data: error },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<BlogStatsResponse>>(
      { data, isError: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error incrementing blog stats:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Failed to increment blog statistics", isError: true, data: error },
      { status: 500 }
    );
  }
}
