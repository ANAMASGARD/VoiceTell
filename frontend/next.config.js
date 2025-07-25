/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Disable image optimization for better compatibility
  images: {
    unoptimized: true,
  },
  
  // Handle build optimizations
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Ensure proper routing
  trailingSlash: false,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default config;
