import { Suspense } from "react";
import { Blogs } from "@/components/blogs/Blogs";
import { MainSearchBox } from "@/components/searchBox";
import Loading from "./blogs/loading";
import Header from "./protected/components/header";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-screen">
        <Header></Header>
        <div className="">
          {/* <MainSearchBox /> */}
          <Suspense fallback={<Loading />}>
            <Blogs />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
