import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface ProfileUpdateData {
    userId: string;
    username: string;
    name: string;
    bio?: string | null;
    avatar_url?: string | null;
    social_media_links?: string[];
}

export async function POST(req: NextRequest) {
    try {
        const body: ProfileUpdateData = await req.json();

        const { userId, username, name, bio, avatar_url, social_media_links } = body;

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required', isError: true },
                { status: 400 }
            );
        }

        if (!username || username.length <= 4) {
            return NextResponse.json(
                { error: 'Username must be more than 4 characters', isError: true },
                { status: 400 }
            );
        }

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Name is required', isError: true },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Check if username is already taken by another user
        const { data: existingUser } = await supabase
            .from('user_public_profiles')
            .select('id')
            .eq('username', username)
            .neq('id', userId)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'Username is already taken', isError: true },
                { status: 409 }
            );
        }

        // Update user profile - matching the users table schema
        const { data, error } = await supabase
            .from('users')
            .update({
                username,
                name,
                bio: bio || null,
                avatar_url: avatar_url || null,
                social_media_links: social_media_links || [],
            })
            .eq('id', userId)
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
