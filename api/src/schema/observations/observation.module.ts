import { PatientController } from '../patients/patient.controller';
import { PatientService } from '../patients/patient.service';
import { Observation, ObservationSchema } from './entities/observation.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class ObservationModule {}
