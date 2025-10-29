import type { NextConfig } from "next";

/**
 * Next.js 16 config:
 * - cacheComponents: enables component-level caching (replacement for experimental.dynamicIO).
 * - images.remotePatterns: secure remote image domains replacement for deprecated images.domains.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "example.com" }
    ]
  }
};

export default nextConfig;
