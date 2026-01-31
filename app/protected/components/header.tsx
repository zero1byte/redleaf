'use client';
import CONSTANT from "@/app/CONSTANT";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { user } = useUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen])
  useEffect(() => {
    //assign height of header_space div to height of header
    const header = document.querySelector('header');
    const headerSpace = document.getElementById('header_space');
    if (header && headerSpace) {
      const headerHeight = header.clientHeight;
      headerSpace.style.height = `${headerHeight}px`;
    }
  }, [])
  return (
    <div className="w-full h-full">
      <header className={`w-screen flex justify-center border-b border-b-foreground/10 h-16 bg-background fixed top-0 z-50 backdrop-blur-md
     ${isMenuOpen ? 'h-screen w-screen items-start' : 'px-5'} transition-padding duration-300`}>
        <div className={`w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm gap-2 ${isMenuOpen ? 'flex-col items-start' : 'flex-row items-center'}`}>
          <div className="flex items-center gap-5 justify-between max-sm:w-full">
            <div className="flex gap-5 items-center font-semibold ">
              <a href="/">{CONSTANT.APP_NAME}</a>
            </div>
            {/* Mobile View */}
            <div className="sm:hidden flex items-center gap-2">
              <MenuIcon size={20} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
          </div>
          <div className={`flex flex-row gap-2 max-sm:hidden ${isMenuOpen ? '!flex' : ''}`}>
            <div className={`flex flex-row gap-2 lg:gap-5 md:gap-2 items-center ${isMenuOpen ? 'flex-col items-start' : 'flex-row'}`}>
              {user ?
                (
                  <div className={`flex gap-2 lg:gap-5 md:gap-0 items-center ${isMenuOpen ? 'flex-col items-start' : 'flex-row'}`}>
                    <a href="/protected/new">New Blog</a>
                    <a href="/protected">Profile</a>
                    <div>
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <div className={`flex gap-2 lg:gap-5 md:gap-0 items-center ${isMenuOpen ? 'flex-col items-start' : 'flex-row'}`}>
                    <Button asChild size="sm" variant={"outline"}>
                      <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button asChild size="sm" variant={"default"}>
                      <Link href="/auth/sign-up">Sign up</Link>
                    </Button>
                  </div>
                )
              }
              <div className="w-1 h-full border-l border-separate max-sm:hidden">

              </div>
              {/* Always show */}
              <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/login">About Me</Link>
              </Button>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>
      <div id="header_space" className="w-full"></div>
    </div>
  );
}