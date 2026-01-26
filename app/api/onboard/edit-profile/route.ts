import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = await createClient();
        const { data: loggedUser } = await supabase.auth.getUser();
        if (!loggedUser || !loggedUser.user) {
            return NextResponse.json(
                { error: 'Unauthorized', isError: true },
                { status: 401 }
            );
        }

        //remove attributes that are null/undefined/empty
        Object.keys(body).forEach((key) => {
            const k = key ;
            if (body[k] === null || body[k] === undefined || (Array.isArray(body[k]) && body[k]?.length === 0)) {
                delete body[k];
            }
        });

        // Update user profile - matching the users table schema
        const { data, error } = await supabase
            .from('users_public_details')
            .update(body)
            .eq('user_id', loggedUser.user.id)
            .select()
            .single();
        if (error) {
            console.error('Error updating profile:', error);
            return NextResponse.json(
                { error: 'Failed to update profile', details: error.message, isError: true },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { data, message: 'Profile updated successfully', isError: false },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in edit-profile API:', error);
        return NextResponse.json(
            { error: 'Internal server error', isError: true },
            { status: 500 }
        );
    }
}
