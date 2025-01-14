import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'], // Add this line to allow images from TMDb
  },
};

export default nextConfig;
