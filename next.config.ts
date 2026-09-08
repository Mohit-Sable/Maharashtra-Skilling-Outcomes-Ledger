import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles only what's needed — ideal for Render / Docker.
  // NOTE: turbopack.root is intentionally NOT set here.
  // Setting it to __dirname bakes the local absolute path (e.g. C:\Users\...)
  // into .next/standalone/server.js at build time, which crashes the server
  // on Render's Linux environment. The lockfile warning it suppresses is harmless on CI.
  output: "standalone",
};

export default nextConfig;
