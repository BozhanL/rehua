import type { Options } from '@typia/unplugin/api';
import unTypiaNext from '@typia/unplugin/next';
import type { NextConfig } from 'next';
import { env } from 'node:process';

const nextConfig: NextConfig = {
  basePath: env['BASE_URL'] ?? '',
  output: 'export',
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

const unpluginTypiaOptions: Options = {
  log: false,
};

export default unTypiaNext(nextConfig, unpluginTypiaOptions);
