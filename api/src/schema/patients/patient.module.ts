import { Patient, PatientSchema } from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
