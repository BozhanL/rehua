import type { Options } from '@typia/unplugin/api';
import unTypiaNext from '@typia/unplugin/next';
import type { NextConfig } from 'next';
import { env } from 'node:process';

const nextConfig: NextConfig = {
  basePath: env['BASE_URL'] ?? '',
  output: 'export',
};

const unpluginTypiaOptions: Options = {
  log: false,
};

export default unTypiaNext(nextConfig, unpluginTypiaOptions);
