import { CreateObservationDto } from './dto/create-observation.dto';
import { ObservationType } from './entities/observation-type.enum';
import { Observation } from './entities/observation.entity';
import { ObservationService } from './observation.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Controller } from '@nestjs/common';

@Controller('observations')
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

  @TypedRoute.Get(':patientId')
  @SwaggerExample.Response('Found', {
    value: new Observation('1', '2026-01-01', ObservationType.HEART_RATE, 80),
  })
  @SwaggerExample.Response('Not Found', { value: null })
  async findAllObservations(
    @TypedParam('patientId') patientId: string,
  ): Promise<(Observation & { _id: string })[]> {
    const docs = await this.observationService.getAllObservations(patientId);

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @TypedRoute.Get(':patientId/type')
  async findByType(
    @TypedParam('patientId') patientId: string,
    @TypedQuery() query: { observationType: ObservationType },
  ): Promise<(Observation & { _id: string })[]> {
    const docs = await this.observationService.getAllSpecificObservationType(
      patientId,
      query.observationType,
    );

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  /*
  @TypedRoute.Get(':id/type/date')
  async findObservationByDate(
    @TypedParam('id') id: string,
    @Query('type') type: ObservationType,
    @Query('startDate') date: string,
  ): Promise<(Observation & { _id: string })[]> {
    const docs = await this.observationService.getObservationByDate(
      id,
      type,
      date,
      date,
    );

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @TypedRoute.Get(':id/type/startDate/endDate')
  async findObservationByDateRange(
    @TypedParam('id') id: string,
    @Query('type') type: ObservationType,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<(Observation & { _id: string })[]> {
    const docs = await this.observationService.getObservationByDate(
      id,
      type,
      startDate,
      endDate,
    );

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }
    */
}
