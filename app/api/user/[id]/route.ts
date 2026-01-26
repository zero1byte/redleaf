// pages/api/me.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { id } = await params;
    try {
        // Fetch user details from the database using the user's ID
        const { data } = await supabase
            .from('users_public_details') // Replace 'users' with your table name || "users_public" for select for other users
            .select('*')
            .eq('user_id', id)
            .single();
        if (!data) return NextResponse.json({ error: 'User not found', isError: true,data }, { status: 404 });
        return NextResponse.json({ data, isError: false }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Unknown error', data: error, isError: true }, { status: 500 });
    }
}
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    try {
        const {updateData} = await req.json();
        const { data: updatedData, error: updateError } = await supabase
            .from('users_public_details') // Replace 'users' with your table name
            .update(updateData)
            .eq('id', id)
            .single();
        if (updateError) {
            console.error('Error updating user:', updateError);
            return NextResponse.json({ error: 'Error updating user', isError: true }, { status: 500 });
        }
        return NextResponse.json({ data: updatedData, isError: false }, { status: 200 });
    } catch (error) {
        console.error('Unknown error:', error);
        return NextResponse.json({ error: 'Unknown error', isError: true }, { status: 500 });
    }
}