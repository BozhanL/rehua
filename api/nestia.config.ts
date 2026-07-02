import { createApp, swaggerConfig } from '@/helpers';
import type { INestiaConfig } from '@nestia/sdk';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const mongod = await MongoMemoryServer.create();

    const app = createApp(
      MongooseModule.forRoot(mongod.getUri(), { dbName: 'rehua' }),
    );

    return app;
  },
  output: '../sdk/src',
  distribute: '../sdk',
  simulate: true,
  clone: true,

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
