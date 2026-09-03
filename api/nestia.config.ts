import { createApp, swaggerConfig } from '@/helpers';
import type { INestiaConfig } from '@nestia/sdk';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import os from 'node:os';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const arch = os.arch();

    // Skip MongoMemoryServer on arm64 architecture to avoid download issues on ARM chips
    if (arch === 'arm64') {
      return createApp();
    }

    const mongod = await MongoMemoryServer.create();

    return createApp(
      MongooseModule.forRoot(mongod.getUri(), { dbName: 'rehua' }),
    );
  },
  output: '../sdk/src',
  distribute: '../sdk',
  simulate: true,
  clone: true,
  assert: true,

  swagger: {
    ...swaggerConfig,

    output: 'swagger.json',

    // openapitools/openapi-diff uses swagger-parser, and it does not support 3.2
    // https://github.com/swagger-api/swagger-parser/issues/2248
    openapi: '3.1',
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
