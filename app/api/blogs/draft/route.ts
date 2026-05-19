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
    },
    is_draft: boolean
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const blog = await req.json();
    //Current User
    const user = await supabase.auth.getUser();
    if (user.data.user) {
        blog.author_id = user.data.user.id;
    }
    blog.is_draft = true; // Ensure that the blog is marked as a draft when created
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

export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Blog ID is required", isError: true }, { status: 400 });
    }

    const blog = await req.json();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        return NextResponse.json({ error: "Unauthorized", isError: true }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .schema("blogs")
            .from("blogs")
            .update(blog)
            .eq("id", id)
            .eq("author_id", user.data.user.id) // Ensure user can only update their own blogs
            .select()
            .eq('is_deleted',false)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
        }

        return NextResponse.json({ data, isError: false }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unknown error", isError: true }, { status: 500 });
    }
}


export interface draftBlog {
    author_id: string,
    banner_image: string | null,
    is_premium: boolean,
    is_deleted: boolean,
    title: string,
    subTitle: string | null,
    contents: string,
    created_at: string,
    id: string,
    is_draft: boolean
    tags: string[]
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const supabase = createClientBackend();
    try {
        const id = searchParams.get('id');
        const user_id = searchParams.get('user_id');
        if (!id) {
            return NextResponse.json({ error: "Blog ID is required", isError: true }, { status: 400 });
        }

        if (user_id) {
            const { data, error } = await supabase
                .schema("blogs")
                .from("blogs")
                .select(`*`)
                .eq("id", id)
                .eq("is_draft", true)
                .eq("is_deleted", false)
                .eq("author_id", user_id)
                .single();
            if (error) {
                return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
            }
            return NextResponse.json({ data, isError: false }, { status: 200 });
        } else {
            const { data, error } = await supabase
                .schema("blogs")
                .from("blogs")
                .select(`*`)
                .eq("id", id)
                .eq("is_draft", true)
                .eq("is_deleted", false)
                .single();
            if (error) {
                return NextResponse.json({ error: error.message, isError: true, data }, { status: 500 });
            }
            return NextResponse.json({ data, isError: false }, { status: 200 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Unknown error", isError: true, data: error }, { status: 500 });
    }
}

