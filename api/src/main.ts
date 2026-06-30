import { AppModule, configModule } from '@/app.module';
import { Config } from '@/utils/config';
import type { INestApplication } from '@nestjs/common';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { readFile } from 'node:fs/promises';

async function getHttpsConfig(): Promise<HttpsOptions> {
  const configApp = await NestFactory.create(configModule);
  const configAppService = configApp.get(ConfigService<Config, true>);
  const httpsConfig = configAppService.get<Config['https']>('https');
  await configApp.close();

  if (!!httpsConfig.cert && !!httpsConfig.key) {
    const key = await readFile(httpsConfig.key, 'utf8');
    const cert = await readFile(httpsConfig.cert, 'utf8');
    return { key, cert };
  }
  return {};
}

export async function createApp(): Promise<INestApplication> {
  const httpsOptions = await getHttpsConfig();
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const configService = app.get(ConfigService<Config, true>);

  app.enableCors({
    origin: configService.get('NODE_ENV') !== 'production',
    credentials: true,
  });

  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const configService = app.get(ConfigService<Config, true>);

  await app.listen(configService.get('PORT'));
}

void bootstrap();
