 /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static export
  images: {
    unoptimized: true, // Prevents image optimization (since Vercel/AWS optimize it automatically)
  },
};

module.exports = nextConfig;

