import { createApp, swaggerConfig } from '@/main';
import type { INestiaConfig } from '@nestia/sdk';

const NESTIA_CONFIG: INestiaConfig = {
  input: createApp,
  output: '../sdk/src',
  distribute: '../sdk',
  simulate: true,
  clone: true,

  swagger: {
    ...swaggerConfig,

    output: 'swagger.json',
    servers: [
      {
        url: 'http://localhost:3001/',
        description: 'Local Server',
      },
    ],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
