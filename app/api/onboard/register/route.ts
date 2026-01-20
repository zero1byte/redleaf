// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { createClient  } from '@/lib/supabase/client';

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { email, password, name } = await request.json();

        // Insert user into Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const userId = authData.user?.id;

        // Insert additional user data into public.users table
        const { error: dbError } = await supabase
            .from('users')
            .insert([{ id: userId, name, email }]);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, user: authData.user });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
