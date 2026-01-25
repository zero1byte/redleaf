import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Helper function to delete existing avatar files
async function deleteExistingAvatar(supabase: any, userId: string) {
    const { data: files } = await supabase.storage
        .from('users_avatars')
        .list(userId);

    if (files && files.length > 0) {
        const filesToDelete = files.map((file: any) => `${userId}/${file.name}`);
        await supabase.storage
            .from('users_avatars')
            .remove(filesToDelete);
    }
}

// Helper function to validate file
function validateFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File too large. Maximum size is 5MB' };
    }

    return { valid: true, error: null };
}

// Helper function to upload avatar
async function uploadAvatar(supabase: any, file: File, userId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
        .from('users_avatars')
        .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true //update previous image if exists
        });
    if (error) {
        return { success: false, error, data: data, url: null };
    }

    const { data: urlData } = supabase.storage
        .from('users_avatars')
        .getPublicUrl(fileName);
    console.log('Public URL data:', urlData);
    return { success: true, error: null, data, url: urlData?.publicUrl };
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const userId = formData.get('userId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided', isError: true },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required', isError: true },
                { status: 400 }
            );
        }

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error, isError: true },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Upload avatar
        const uploadResult = await uploadAvatar(supabase, file, userId);

        if (!uploadResult.success) {
            console.error('Supabase upload error:', uploadResult.error);
            return NextResponse.json(
                { error: 'Failed to upload avatar', details: uploadResult.error?.message, isError: true },
                { status: 500 }
            );
        }

        // Update user's avatar_url in the database
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: uploadResult.url })
            .eq('id', userId);

        if (updateError) {
            console.error('Database update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update user avatar', details: updateError.message, isError: true },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                data: {
                    path: uploadResult.data?.path,
                    url: uploadResult.url
                },
                message: 'Avatar uploaded successfully',
                isError: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error', isError: true },
            { status: 500 }
        );
    }
}

// PUT - Update avatar (delete old and upload new)
export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const userId = formData.get('userId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided', isError: true },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required', isError: true },
                { status: 400 }
            );
        }

        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error, isError: true },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Delete existing avatar files first
        await deleteExistingAvatar(supabase, userId);

        // Upload new avatar
        const uploadResult = await uploadAvatar(supabase, file, userId);

        if (!uploadResult.success) {
            console.error('Supabase upload error:', uploadResult.error);
            return NextResponse.json(
                { error: 'Failed to upload avatar', details: uploadResult.error?.message, isError: true },
                { status: 500 }
            );
        }

        // Update user's avatar_url in the database
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: uploadResult.url })
            .eq('id', userId);

        if (updateError) {
            console.error('Database update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update user avatar', details: updateError.message, isError: true },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                data: {
                    path: uploadResult.data?.path,
                    url: uploadResult.url
                },
                message: 'Avatar updated successfully',
                isError: false
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Avatar update error:', error);
        return NextResponse.json(
            { error: 'Internal server error', isError: true },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required', isError: true },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Delete existing avatar files
        await deleteExistingAvatar(supabase, userId);

        // Update user's avatar_url to null
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: null })
            .eq('id', userId);

        if (updateError) {
            console.error('Database update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update user', isError: true },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Avatar deleted successfully', isError: false },
            { status: 200 }
        );

    } catch (error) {
        console.error('Avatar delete error:', error);
        return NextResponse.json(
            { error: 'Internal server error', isError: true },
            { status: 500 }
        );
    }
}

