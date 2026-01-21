import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.citypng.com" },
      { protocol: "https", hostname: "www.pngall.com" },
    ],
  },
};

export default nextConfig;
