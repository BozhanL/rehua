import { createApp } from '@/main';
import type { INestiaConfig } from '@nestia/sdk';

const NESTIA_CONFIG: INestiaConfig = {
  input: createApp,
  output: '../sdk/src',
  distribute: '../sdk',
  simulate: true,
  clone: true,
};
export default NESTIA_CONFIG;
