import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // `next/package.json` should be resolvable from this directory.
    // When dependencies are installed correctly, this avoids "workspace root inference".
    root: __dirname,
  },
};

export default nextConfig;
