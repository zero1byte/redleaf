import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export default async function POST(
    req: NextRequest,
    res: NextResponse
) {
    const supabase =await createClient();
    const blog = await req.json();
    try {
        const { data, error } =await supabase
            .from("blogs")
            .insert(blog);
    } catch (error) {
        
    }
}