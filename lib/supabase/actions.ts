'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const signInWith = (provider: "google" | "github" | "azure") => async () => {
    const supabase = await createClient()

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    if (error) {
        console.log(error)
    }

    redirect(data.url || '/')
}

export const signinWithGoogle = signInWith('google')
