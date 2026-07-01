import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { Config, https } from './utils/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi, { CustomHelpers, ErrorReport } from 'joi';
import { accessSync, constants } from 'node:fs';
import { readFile } from 'node:fs/promises';
import typia from 'typia';

// Allow e2e test to override this module
export const mongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService<Config, true>) => ({
    uri: (
      await readFile(
        typia.assert<NonNullable<Config['MONGODB_URI_FILE']>>(
          configService.get<Config['MONGODB_URI_FILE']>('MONGODB_URI_FILE'),
        ),
        'utf8',
      )
    ).trim(),
    dbName: 'rehua',
  }),
  inject: [ConfigService],
});

// Allow bootstrap to create this module and read https config
export const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'nestia')
      .required(),
    PORT: Joi.number().port().default(3001),
    API_CERT: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_KEY: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_CA: requiredReadableFilePath(['test', 'development', 'nestia']),
    MONGODB_URI_FILE: requiredReadableFilePath(['test', 'nestia']),
  }),
  load: [https],
});

// eslint-disable-next-line sonarjs/function-return-type
function fileExistsValidator(
  value: string,
  helpers: CustomHelpers,
): string | ErrorReport {
  try {
    accessSync(value, constants.R_OK);
    return value;
  } catch (e) {
    return typia.is<Error>(e)
      ? helpers.error(e.message)
      : helpers.error(
          'Unknown error during MONGODB_URI_FILE file permission validation',
        );
  }
}

function requiredReadableFilePath(
  skipEnvs: Config['NODE_ENV'][],
): Joi.StringSchema {
  return Joi.string()
    .when('NODE_ENV', {
      is: Joi.valid(...skipEnvs),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .custom(fileExistsValidator, 'file permission validation');
}

@Module({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {
  static forRoot(disableMongo: boolean): DynamicModule {
    return {
      module: AppModule,
      imports: [
        configModule,
        HelloModule,
        ...(disableMongo ? [] : [mongoModule]),
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
