import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HelloModule } from './hello/hello.module';
import { ManualModule } from './manual/manual.module';
import { EmergencyContactModule } from './schema/emergency_contacts/emergency_contact.module';
import { ObservationModule } from './schema/observations/observation.module';
import { PatientModule } from './schema/patients/patient.module';
import { UserModule } from './schema/users/user.module';
import { Config, configModule } from './utils/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { readFile } from 'fs-extra';

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

@Module({
  imports: [
    configModule,
    HelloModule,
    AuthModule,
    UserModule,
    EmergencyContactModule,
    ObservationModule,
    PatientModule,
    ManualModule,
  ],
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
