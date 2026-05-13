/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGhPages = process.env.GITHUB_PAGES === 'true';
const repo = 'Front-clasificador';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
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
};

export default nextConfig;
