import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // /blog/<slug>/index.html — works on any static host without rewrite rules.
  trailingSlash: true,
  images: { unoptimized: true },
  // The e2e tests build into a separate folder (with a mocked form endpoint) so they never touch .next/ or out/.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
