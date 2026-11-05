import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Standard App Router SSR configuration */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
