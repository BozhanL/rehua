import { CreateObservationDto } from './dto/create-observation.dto';
import { ObservationType } from './entities/observation-type.enum';
import { Observation } from './entities/observation.entity';
import { ObservationService } from './observation.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Controller, Query } from '@nestjs/common';

@Controller('patients/:id/observations')
export class ObservationsController {
  constructor(private readonly observationService: ObservationService) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createObservationDto: CreateObservationDto,
  ): Promise<Observation & { _id: string }> {
    const doc = await this.observationService.create(createObservationDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get(':id')
  @SwaggerExample.Response('Found', {
    value: new Observation(
      '1',
      new Date('2026-01-01'),
      ObservationType.HEART_RATE,
      80,
    ),
  })
  @SwaggerExample.Response('Not Found', { value: null })
  async findAllObservations(
    @TypedParam('id') id: string,
  ): Promise<Observation[] | null> {
    return this.observationService.getAllObservations(id);
  }

  @TypedRoute.Get(':id/:type')
  async findByType(
    @TypedParam('id') id: string,
    @Query('type') type: ObservationType,
  ): Promise<Observation[] | null> {
    return this.observationService.getAllSpecificObservationType(id, type);
  }

  @TypedRoute.Get(':id/:type/:date')
  async findObservationByDate(
    @TypedParam('id') id: string,
    @Query('type') type: ObservationType,
    @Query('startDate') date: string,
  ): Promise<Observation[] | null> {
    return this.observationService.getObservationByDate(id, type, date, date);
  }

  @TypedRoute.Get(':id/:type/:startDate/:endDate')
  async findObservationByDateRange(
    @TypedParam('id') id: string,
    @Query('type') type: ObservationType,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Observation[] | null> {
    return this.observationService.getObservationByDate(
      id,
      type,
      startDate,
      endDate,
    );
  }
}
