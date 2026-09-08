import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles only what's needed — ideal for Render / Docker
  output: "standalone",

  // Pin turbopack root to the msol directory to avoid the lockfile warning
  // (Next.js was detecting the parent SIH-2026/package-lock.json as the root)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
