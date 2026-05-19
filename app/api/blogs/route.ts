import { createClient } from "@/lib/supabase/server";
import { createClient as createClientBackend } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export interface Blog {
    created_at: string,
    author_id: string,
    is_premium: boolean,
    is_deleted: boolean,
    title: string,
    subTitle: string | null,
    contents: string,
    id: string,
    banner_image: string | null,
    author: {
        username: string,
        full_name: string,
        avatar_url: string,
        followers_count: number,
        following_count: number
    }
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const blog = await req.json();
    //Current User
    const user = await supabase.auth.getUser();
    if (user.data.user) {
        blog.author_id = user.data.user.id;
    }
    try {
        const { data, error } = await supabase
            .schema("blogs")
            .from("blogs")
            .insert(blog as Blog)
            .select()
            .single();
        if (error) {
            return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
        }

        return NextResponse.json({ data, isError: false }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Unknown error", isError: true }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const supabase = createClientBackend();
    try {
        const id = searchParams.get('id');
        const q = searchParams.get('q')?.trim() || '';
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 20;
        const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') as string) : 0;
        if (id) {
            const { data, error } = await supabase
                .schema("blogs")
                .from("blogs_with_author")
                .select(`*`)
                .eq("id", id)
                .eq("is_draft", false)
                .eq('is_deleted', false)
                .single();
            if (error) {
                return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
            }
            return NextResponse.json({ data, isError: false }, { status: 200 });
        }
        let blogsQuery = supabase
            .schema("blogs")
            .from("blogs_with_author")
            .select(`*`)
            .eq("is_draft", false)
            .eq('is_deleted', false);

        if (q.length > 0) {
            const normalizedQuery = q.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
            blogsQuery = blogsQuery.or(`title.ilike.%${normalizedQuery}%,subTitle.ilike.%${normalizedQuery}%,contents.ilike.%${normalizedQuery}%`);
        }

        const { data, error } = await blogsQuery
            .order("created_at", { ascending: false })
            .range(offset || 0, ((offset || 0) + (limit || 10)) - 1);
        if (error) {
            return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
        }
        return NextResponse.json({ data, isError: false }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Unknown error", isError: true, data: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized", isError: true }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .schema("blogs")
            .from("blogs")
            .update({ is_deleted: true })
            .eq("id", id)
            .eq("author_id", user.data.user.id)

        if (error) {
            return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
        }

        return NextResponse.json({ data, isError: false }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unknown error", isError: true }, { status: 500 });
    }
}