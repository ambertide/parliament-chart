import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => ([
    {
      source: '/:lang',
      destination: '/:lang/terms/28',
      permanent: false
    },
    {
      source: "/:lang/terms/:term",
      destination: "/:lang/terms/:term/formation",
      permanent: false
    }
  ])
  /* config options here */
};

export default nextConfig;
