import { createClient } from "@/lib/supabase/server";

export const currentUser =async () => {
    const client =await createClient();
    const data = await client.auth.getUser();
    console.log(data);
    return data
}