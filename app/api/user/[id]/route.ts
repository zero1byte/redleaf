// pages/api/me.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isError } from 'postcss/lib/css-syntax-error';

type UserDetails = {
    id: string;
    // Add other fields as per your Supabase table
    [key: string]: any;
};

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
    res: NextResponse<UserDetails | { error: string, data?: any, isError: boolean }>
) {
    const { id } = await params;
    const supabase = await createClient();
    try {
        // Fetch user details from the database using the user's ID
        const { data } = await supabase
            .from('users') // Replace 'users' with your table name || "users_public" for select for other users
            .select('*')
            .eq('id', id)
            .single();
        if (!data) return NextResponse.json({ error: 'User not found', isError: true }, { status: 404 });

        return NextResponse.json({ data, isError: false }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Unknown error', data: error, isError: true }, { status: 500 });
    }
}