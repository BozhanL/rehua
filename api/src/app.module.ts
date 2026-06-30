import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { Config } from './utils/config';
import { Module } from '@nestjs/common';
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
      await readFile(configService.get<string>('MONGODB_URI_FILE'), 'utf8')
    ).trim(),
    dbName: 'rehua',
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    mongoModule,

    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        PORT: Joi.number().port().default(3001),
        MONGODB_URI_FILE: Joi.string()
          .when('NODE_ENV', {
            is: 'test',
            then: Joi.optional(),
            otherwise: Joi.required(),
          })
          .custom(
            // eslint-disable-next-line sonarjs/function-return-type
            (value: string, helpers: CustomHelpers): string | ErrorReport => {
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
            },
            'file permission validation',
          ),
      }),
    }),

    HelloModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
