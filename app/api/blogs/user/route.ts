import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface Blog {
    id: string;
    title: string;
    subTitle: string | null;
    contents: string;
    banner_image: string | null;
    created_at: string;
    is_draft: boolean;
    author_id: string;
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();

    try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", isError: true },
                { status: 401 }
            );
        }

        // Fetch user's blogs
        const { data: blogs, error: blogsError } = await supabase
            .schema("blogs")
            .from("blogs")
            .select("*")
            .eq("author_id", user.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false });

        if (blogsError) {
            return NextResponse.json(
                { error: blogsError.message, isError: true },
                { status: 500 }
            );
        }

        // Separate drafted and published blogs
        const drafted = blogs?.filter((blog: Blog) => blog.is_draft) || [];
        const published = blogs?.filter((blog: Blog) => !blog.is_draft) || [];

        return NextResponse.json(
            {
                data: {
                    drafted,
                    published,
                    total: blogs?.length || 0,
                },
                isError: false,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user blogs:", error);
        return NextResponse.json(
            { error: "Unknown error", isError: true },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
        return NextResponse.json(
            { error: "Blog ID is required", isError: true },
            { status: 400 }
        );
    }

    try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", isError: true },
                { status: 401 }
            );
        }

        // Delete blog (soft delete by marking is_deleted = true)
        const { error: deleteError } = await supabase
            .schema("blogs")
            .from("blogs")
            .update({ is_deleted: true })
            .eq("id", blogId)
            .eq("author_id", user.id);

        if (deleteError) {
            return NextResponse.json(
                { error: deleteError.message, isError: true },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { data: { id: blogId }, isError: false },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { error: "Unknown error", isError: true },
            { status: 500 }
        );
    }
}
