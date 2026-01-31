import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = "blog_images";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized", isError: true },
                { status: 401 }
            );
        }

        // Parse form data
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as string || 'blog-image';

        if (!file) {
            return NextResponse.json(
                { error: "No file provided", isError: true },
                { status: 400 }
            );
        }

        // Validate file type (image/*)
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: "Invalid file type. Only images are allowed.", isError: true },
                { status: 400 }
            );
        }

        // Validate file size (50MB max)
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 50MB", isError: true },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop() || 'jpg';
        const timestamp = Date.now();
        const randomId = crypto.randomUUID().slice(0, 8);
        const fileName = `${user.id}/${type}/${timestamp}-${randomId}.${fileExt}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json(
                { error: `Upload failed: ${uploadError.message}`, isError: true },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(uploadData.path);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: uploadData.path,
            isError: false,
        }, { status: 200 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: "An unexpected error occurred", isError: true,data:error },
            { status: 500 }
        );
    }
}
