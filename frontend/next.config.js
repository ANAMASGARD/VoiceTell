/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Essential settings for Vercel deployment
  images: {
    unoptimized: true,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  trailingSlash: false,
};

export default config;
