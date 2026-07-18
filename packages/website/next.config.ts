import type { NextConfig } from "next";
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  redirects: async () => ([
    {
      source: "/",
      destination: "/tr",
      permanent: true
    },
    {
      source: "/:lang/terms/:term",
      destination: "/:lang/terms/:term/formation",
      permanent: false
    }
  ]),
  devIndicators: false,
  pageExtensions: ['ts', 'tsx', 'md'],
  /* config options here */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        // customize default plugin options
                        removeViewBox: false,
                      },
                    },
                  },
                  'removeDimensions',
                  "prefixIds"
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [['rehype-raw']],
  },
});

export default withMDX(nextConfig);
