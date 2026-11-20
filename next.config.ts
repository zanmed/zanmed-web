import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      { protocol: "https", hostname: "*.imagekit.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/products/:slug.md",
        destination: "/md/products/:slug",
      },
    ];
  },
};

export default nextConfig;
