import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.citypng.com" },
      { protocol: "https", hostname: "www.pngall.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "zerobytes.me" },
      { protocol: "https", hostname: "xvkdsmspuyvzyzcpjiwk.supabase.co" },
    ],
  },
};

export default nextConfig;
