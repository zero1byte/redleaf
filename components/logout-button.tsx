"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useAuthUserStore from "@/store/useUserStore";

export function LogoutButton() {
  const router = useRouter();
  const { clearUser } = useAuthUserStore();
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
