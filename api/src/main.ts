import { createApp, swaggerConfig } from './helpers';
import type { Config } from '@/utils/config';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import { ConfigService } from '@nestjs/config';
import { type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import typia from 'typia';

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
