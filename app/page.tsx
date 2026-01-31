import { Suspense } from "react";
import { Blogs } from "@/components/blogs/Blogs";
import Loading from "./blogs/loading";
import Header from "./protected/components/header";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-2 items-center">
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
