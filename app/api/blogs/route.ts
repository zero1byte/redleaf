import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const blog = await req.json();
    try {
        const { data, error } = await supabase
            .from("blogs")
            .insert(blog)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message, isError: true }, { status: 500 });
        }

        return NextResponse.json({ data, isError: false }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Unknown error", isError: true }, { status: 500 });
    }
}