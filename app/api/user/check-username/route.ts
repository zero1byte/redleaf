import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json({ error: 'Username is required', isError: true }, { status: 400 });
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('user_public_profiles')
            .select('username')
            .eq('username', username)
            .single();

        // If no data found, username is available
        // If data exists, username is taken
        const isAvailable = !data;

        return NextResponse.json({ available: isAvailable, isError: false }, { status: 200 });
    } catch (error) {
        console.error('Error checking username:', error);
        return NextResponse.json({ error: 'Unknown error', isError: true }, { status: 500 });
    }
}