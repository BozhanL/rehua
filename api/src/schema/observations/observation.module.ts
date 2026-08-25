import { Observation, ObservationSchema } from './entities/observation.entity';
import { ObservationsController } from './observation.controller';
import { ObservationService } from './observation.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  controllers: [ObservationsController],
  providers: [ObservationService],
})
export class ObservationModule {}
