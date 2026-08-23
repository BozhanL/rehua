import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HelloModule } from './hello/hello.module';
import { ManualModule } from './manual/manual.module';
import { UsersModule } from './users/users.module';
import { Config, https } from './utils/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { accessSync, constants, mkdtempSync, readFile } from 'fs-extra';
import Joi, { CustomHelpers, ErrorReport } from 'joi';
import { tmpdir } from 'node:os';
import path from 'node:path';
import typia from 'typia';

// Allow e2e test to override this module
export const mongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService<Config, true>) => ({
    uri: (
      await readFile(
        configService.getOrThrow<Config['MONGODB_URI_FILE']>(
          'MONGODB_URI_FILE',
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
    DATA_PATH: requiredReadableFilePath(
      ['test', 'nestia'],
      constants.W_OK | constants.R_OK,
    )
      // TODO: remove this dir after the test is done
      .default(() => mkdtempSync(path.join(tmpdir(), 'rehua-'))),
  }),
  load: [https],
});

// eslint-disable-next-line sonarjs/function-return-type
function fileExistsValidator(
  value: string,
  helpers: CustomHelpers,
  accessMode: number,
): string | ErrorReport {
  try {
    accessSync(value, accessMode);
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
  accessMode: number = constants.R_OK,
): Joi.StringSchema {
  return Joi.string().when('NODE_ENV', {
    is: Joi.valid(...skipEnvs),
    then: Joi.optional(),
    otherwise: Joi.required().custom(
      (value: string, helpers: CustomHelpers) =>
        fileExistsValidator(value, helpers, accessMode),

      'file permission validation',
    ),
  });
}

@Module({
  imports: [configModule, HelloModule, AuthModule, UsersModule, ManualModule],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {
  static forRoot(mongo: DynamicModule | undefined): DynamicModule {
    return {
      module: AppModule,
      imports: [mongo ?? mongoModule],
    };
  }
}
