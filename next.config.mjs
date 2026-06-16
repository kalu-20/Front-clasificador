/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGhPages = process.env.GITHUB_PAGES === 'true';
const repo = 'Front-clasificador';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
  basePath: isProd && isGhPages ? `/${repo}` : undefined,
  assetPrefix: isProd && isGhPages ? `/${repo}/` : undefined,
  compiler: {
    removeConsole: isProd ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap', 'swiper'],
  },
  // Build estático: encoding del flag para skip lint/type-check sólo si
  // el orquestador / CI ya los corrió en otro paso. En CI normal, dejá false.
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === '1',
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPECHECK === '1',
  },
};

export default nextConfig;
