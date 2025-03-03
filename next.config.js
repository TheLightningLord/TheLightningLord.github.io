/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static export
  basePath: '/TheLightningLord.github.io', // Use your GitHub repository name here
  assetPrefix: '/olympian-health-solutions/', // Ensures correct static asset paths
  images: {
    unoptimized: true // Avoids Next.js image optimization (not supported by GitHub Pages)
  },
};

module.exports = nextConfig;
