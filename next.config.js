/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    serverActions: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    domains: [
      "lh3.googleusercontent.com",
      "vercel.com",
      "dummyimage.com",
      "cdn.pixabay.com",
      "images.unsplash.com",
      "imgur.com",
    ],
  },
};

module.exports = nextConfig;
