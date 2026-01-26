'use client';
import { AuthButton } from "@/components/auth-button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

export default function Header() {
  const { user } = useUserStore()
  console.log("Header User:", user);
  return (
    <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <a href="/">Redleaf</a>
        </div>
        <div className="flex flex-row gap-2">
          {user ?
            (<div className="flex flex-row gap-2">
              <div className="flex gap-5 items-center">
                <a href="/protected/">Dashboard</a>
                <a href="/settings">Settings</a>
                <div>
                  <LogoutButton />
                </div>
              </div>
            </div>) : (
              <div className="flex gap-5 items-center">
                <Button asChild size="sm" variant={"outline"}>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" variant={"default"}>
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
                <ThemeSwitcher />
              </div>
            )
          }
        </div>
      </div>
    </header>
  );
}