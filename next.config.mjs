/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Server Actions are enabled by default in Next 15; kept explicit for clarity.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
