import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/using_ezBIDS',
        destination: '/docs/using_ezBIDS',
      },
      {
        source: '/using_ezBIDS/',
        destination: '/docs/using_ezBIDS',
      },
    ];
  },
};

export default nextConfig;
