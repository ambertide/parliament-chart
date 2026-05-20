import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: "export",
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
  ]),
  pageExtensions: ['ts', 'tsx', 'md']
  /* config options here */
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
