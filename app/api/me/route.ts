// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {  getCurrentUser } from '@/lib/supabase/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/proxy';

type UserDetails = {
    id: string;
    // Add other fields as per your Supabase table
    [key: string]: any;
};

export async function GET(
    req: NextRequest,
    res: NextResponse<UserDetails | { error: string }>
) {
    let user;
    try {
        const {data} = await getCurrentUser() as any;
        user = data.user;   
        if (!user) {
            return NextResponse.json({ error: 'Not authenticated', isError: true }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Not authenticated', isError: true }, { status: 401 });
    }

    try {
        // Fetch user details from the database using the user's ID
        const { data, error } = await supabase
            .from('users') // Replace 'users' with your table name
            .select('*')
            .eq('id', user.id || '')
            .single();

        if (error) throw error;
        if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ data , isError: false }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Unknown error', data: error }, { status: 500 });
    }
}
