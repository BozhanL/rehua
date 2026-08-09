import { CreateObservationDto } from './dto/create-observation.dto';
import { ObservationType } from './entities/observation-type.enum';
import {
  Observation,
  ObservationDocument,
} from './entities/observation.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ObservationService {
  constructor(
    @InjectModel(Observation.name)
    private readonly observationModel: Model<Observation>,
  ) {}

  //Create a new observation
  async create(
    createObservationDto: CreateObservationDto,
  ): Promise<ObservationDocument> {
    const createdObservation = new this.observationModel(createObservationDto);
    return createdObservation.save();
  }

  //Get all observations for a patient
  async getAllObservations(patientId: string): Promise<ObservationDocument[]> {
    return this.observationModel
      .find({ patientId })
      .sort({ dateTime: -1 })
      .exec();
  }

  //Return a specific type of observation found in observation-type.enum
  async getAllSpecificObservationType(
    patientId: string,
    observationType: ObservationType,
  ): Promise<ObservationDocument[]> {
    return this.observationModel
      .find({ patientId, observationType })
      .sort({ dateTime: -1 })
      .exec();
  }

  //Return custom period, but date value is needed
  /*
  async getObservationByDate(
    patientId: string,
    type: ObservationType,
    startDateStr: string,
    endDateStr: string,
  ): Promise<ObservationDocument[]> {
    //convert provided date to Date object and set 24 hour period
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    
    return this.observationModel
      .find({
        patientId,
        type,
        dateTime: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ dateTime: -1 })
      .exec();
  }
  */
}
