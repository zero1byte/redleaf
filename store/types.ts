import { AuthTokenResponsePassword } from "@supabase/supabase-js";

export type StorageAuthUser = AuthTokenResponsePassword['data']['user'];

export type loggedUser = {
    avatar_url: string | null
    billing_id: null | string
    blog_count: number
    created_at: string
    description: string | null
    email: string
    follower_count: number
    following_count: number
    id: string
    is_suscribe: boolean
    name: string
    saved: [any]
    social_media_links: [string]
    username: string
};