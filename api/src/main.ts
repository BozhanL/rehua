import { AppModule, configModule } from '@/app.module';
import type { Config } from '@/utils/config';
import { INestiaConfig, NestiaSwaggerComposer } from '@nestia/sdk';
import type { INestApplication } from '@nestjs/common';
import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import type { ServerOptions } from 'node:https';
import typia from 'typia';

async function getHttpsConfig(): Promise<ServerOptions | undefined> {
  const configApp = await NestFactory.create(configModule);
  const configAppService = configApp.get(ConfigService<Config, true>);
  const httpsConfig = configAppService.get<Config['https']>('https');
  await configApp.close();

  if (!!httpsConfig.cert && !!httpsConfig.key && !!httpsConfig.ca) {
    const key = await readFile(httpsConfig.key, 'utf8');
    const cert = await readFile(httpsConfig.cert, 'utf8');
    const ca = await readFile(httpsConfig.ca, 'utf8');
    return {
      key,
      cert,
      ca,
      requestCert: true,
      rejectUnauthorized: true,

      // `HttpsOptions` is missing these properties, but NestJS passes
      // `httpsOptions` directly to `https.createServer()`, so Node.js
      // `ServerOptions` such as `minVersion` and `maxVersion` are honored.
      // See:
      // https://github.com/nestjs/nest/blob/f7ed2e23397cde966c0fc21426a611d82fd31c3a/packages/platform-express/adapters/express-adapter.ts#L272-L286
      maxVersion: 'TLSv1.3',
      minVersion: 'TLSv1.3',
    };
  }
  return undefined;
}

async function getNodeEnv(): Promise<Config['NODE_ENV']> {
  const configApp = await NestFactory.create(configModule);
  const configAppService = configApp.get(ConfigService<Config, true>);
  const nodeEnv = configAppService.get<Config['NODE_ENV']>('NODE_ENV');
  await configApp.close();

  return nodeEnv;
}

export const swaggerConfig: Omit<INestiaConfig.ISwaggerConfig, 'output'> = {
  openapi: '3.2',
  servers: [{ url: '/', description: 'Local Server' }],
};

export async function createApp(): Promise<INestApplication> {
  const httpsOptions = typia.assert<HttpsOptions | undefined>(
    await getHttpsConfig(),
  );

  const nodeEnv = await getNodeEnv();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(nodeEnv === 'production' || nodeEnv === 'development'),
    {
      ...(httpsOptions && { httpsOptions }),
    },
  );

  const configService = app.get(ConfigService<Config, true>);

  app.enableCors({
    origin: configService.get<Config['NODE_ENV']>('NODE_ENV') !== 'production',
    credentials: true,
  });

  app.disable('x-powered-by');

  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const configService = app.get(ConfigService<Config, true>);

  if (configService.get<Config['NODE_ENV']>('NODE_ENV') !== 'production') {
    const document = await NestiaSwaggerComposer.document(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, typia.assert<OpenAPIObject>(document), {
      jsonDocumentUrl: 'swagger/json',
      yamlDocumentUrl: 'swagger/yaml',
    });
  }

  await app.listen(configService.get<Config['PORT']>('PORT'));
}

void bootstrap();
