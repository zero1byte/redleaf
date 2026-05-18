/**
 * Blog Comments API
 * Handles CRUD operations for blog comments
 * Route: /api/blogs/[id]/comments
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import {
    BlogComment,
    BlogCommentsResponse,
    CreateCommentPayload,
    ApiResponse,
    ApiErrorResponse,
} from "../../types";

/**
 * GET /api/blogs/[id]/comments
 * Retrieves comments for a specific blog with pagination
 * Query params:
 *   - limit (optional): Number of comments per page (default: 20)
 *   - offset (optional): Pagination offset (default: 0)
 *   - page (optional): Page number (if provided, offset is calculated)
 *   - sort (optional): Sort order - 'recent' or 'popular' (default: 'recent')
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
        const limit = Math.min(
            parseInt(searchParams.get("limit") || "20"),
            100
        );
        const page = parseInt(searchParams.get("page") || "1");
        const offset = (page - 1) * limit;
        const sort = searchParams.get("sort") || "recent";

        // Fetch comments using RPC function in blogs schema
        const { data, error } = await supabase
            .schema("blogs")
            .rpc("get_blog_comments", {
                p_blog_id: id,
            }).limit(limit); // RPC returns a single row with comments array and total_count

        if (error) {
            return NextResponse.json<ApiErrorResponse>(
                { error: error.message, isError: true, data: error },
                { status: 500 }
            );
        }

        // Parse the response - RPC should return { comments, total_count }
        const response: BlogCommentsResponse = {
            comments: data?.comments || [],
            total_count: data?.total_count || 0,
            page,
            limit,
        };

        return NextResponse.json<ApiResponse<BlogCommentsResponse>>(
            { data: response, isError: false },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching blog comments:", error);
        return NextResponse.json<ApiErrorResponse>(
            { error: "Failed to fetch comments", isError: true, data: error },
            { status: 500 }
        );
    }
}

/**
 * POST /api/blogs/[id]/comments
 * Creates a new comment on a blog
 * Request body:
 *   - content (required): Comment text
 *   - parent_comment_id (optional): For nested replies
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

        const payload: CreateCommentPayload = await req.json();

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

        // Verify blog exists
        const { data: blogExists, error: blogError } = await supabase
            .schema("blogs")
            .from("blogs")
            .select("id")
            .eq("id", id)
            .single();

        if (blogError || !blogExists) {
            return NextResponse.json<ApiErrorResponse>(
                { error: "Blog not found", isError: true },
                { status: 404 }
            );
        }

        // If parent_comment_id provided, verify it exists
        if (payload.parent_comment_id) {
            const { data: parentExists, error: parentError } = await supabase
                .schema("blogs")
                .from("blog_comments")
                .select("id")
                .eq("id", payload.parent_comment_id)
                .eq("blog_id", id)
                .single();

            if (parentError || !parentExists) {
                return NextResponse.json<ApiErrorResponse>(
                    { error: "Parent comment not found", isError: true },
                    { status: 404 }
                );
            }
        }

        // Create comment
        const commentData = {
            blog_id: id,
            user_id: user.data.user.id,
            content: payload.content.trim(),
            parent_id: payload.parent_comment_id || null,
            is_deleted: false,
        };

        const { data, error } = await supabase
            .schema("blogs")
            .from("blog_comments")
            .insert(commentData)
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
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json<ApiErrorResponse>(
            { error: "Failed to create comment", isError: true, data: error },
            { status: 500 }
        );
    }
}
