import { AuthTokenResponsePassword } from "@supabase/supabase-js";

export type StorageAuthUser = AuthTokenResponsePassword['data']['user'];

export type loggedUser = {
    billing_id: null | string
    email: string
    is_subscribe: boolean
    saved: [any]
    
    username: string
    avatar_url: string | null
    blog_count: number
    created_at: string
    bio: string | null
    follower_count: number
    following_count: number
    id: string
    name: string
    social_media_links: [string]
};