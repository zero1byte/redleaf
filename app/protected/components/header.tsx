'use client';
import { AuthButton } from "@/components/auth-button";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

export default function Header() {
  const { user } = useUserStore()
  return (
    <header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm gap-2">
        <div className="flex gap-5 items-center font-semibold ">
          <a href="/">Redleaf</a>
        </div>
        <div className="flex flex-row gap-0 max-sm:gap-1">
          {user ?
            (<div className="flex flex-row gap-0">
              <div className="flex gap-2 lg:gap-5 md:gap-0 items-center">
                <a href="/protected/">Dashboard</a>
                <a href="/settings">Settings</a>
                <ThemeSwitcher />
                <div>
                  <LogoutButton />
                </div>
              </div>
            </div>) : (
              <div className="flex gap-2 lg:gap-5 md:gap-0 items-center">
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