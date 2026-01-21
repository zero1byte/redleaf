// lib/supabaseAuth.ts
import { createClient } from './server';
export const getCurrentUser = async () => {
    const res = (await createClient()).auth.getUser();
    return res;
};
