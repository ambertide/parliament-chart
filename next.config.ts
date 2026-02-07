import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => ([
    {
      source: '/',
      destination: '/terms/28',
      permanent: true
    }
  ])
  /* config options here */
};

export default nextConfig;
