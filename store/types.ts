import { AuthTokenResponsePassword } from "@supabase/supabase-js";

export type StorageAuthUser = AuthTokenResponsePassword['data']['user'];

export type loggedUser = {
    user_id: string;
    created_at: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    following_count: number;
    followers_count: number;
    social_media_linkes: [string] | null;
    rating: number;
    blogs_count: number;
};