import { AppModule } from '@/app.module';
import { Config } from '@/utils/config';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
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
