import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { Config } from './utils/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';

// Allow e2e test to override this module
export const mongoModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<Config, true>) => ({
    uri: configService.get<string>('MONGODB_URI'),
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
        MONGODB_URI: Joi.string()
          .uri({ scheme: ['mongodb', 'mongodb+srv'] })
          .when('NODE_ENV', {
            is: 'test',
            then: Joi.optional(),
            otherwise: Joi.required(),
          }),
      }),
    }),

    HelloModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
