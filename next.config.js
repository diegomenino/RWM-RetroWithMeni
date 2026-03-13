/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'better-sqlite3': false,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
