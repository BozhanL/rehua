import { AppModule } from '@/app.module';
import { isProduction } from '@/utils/env';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: !isProduction,
    credentials: true,
  });

  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createApp();
  await app.listen(process.env['PORT'] ?? 3001);
}

void bootstrap();
