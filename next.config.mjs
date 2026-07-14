/**
 * Next.js configuration.
 *
 * Phase 0 keeps this intentionally lean. WebGL-specific concerns
 * (shader loaders, asset transforms) are added in their respective phases
 * so the foundation stays honest about what it actually ships.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are decorative/illustrated; we manage optimization per-asset later.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
