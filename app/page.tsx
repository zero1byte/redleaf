import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import CONSTANT from "./CONSTANT";

import { Blogs } from "@/components/blogs/Blogs";
import Loading from "./blogs/loading";
import { Button } from "@/components/onboarding/ui/formButton";
import Header from "./protected/components/header";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-2 items-center">
        {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/">
                {CONSTANT.APP_NAME}
              </Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <div className="flex gap-4 items-center">
                <Suspense fallback={<div>Loading...</div>}>
                  <AuthButton />
                </Suspense>
                <Button>
                  <Link href="/protected/new">Create Blog</Link>
                </Button>
                <ThemeSwitcher />
              </div>
            )}
          </div>
        </nav> */}
        <Header></Header>
        <main className="flex flex-col gap-2 max-w-5xl p-5">
          <Suspense fallback={<Loading />}>
            <Blogs />
          </Suspense>
        </main>
      </div>
    </main>
  );
}
