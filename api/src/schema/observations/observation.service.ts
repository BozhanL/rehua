import { CreateObservationDto } from './dto/create-observation.dto';
import { UpdateObservationDto } from './dto/update-observation.dto';
import { ObservationType } from './entities/observation-type.enum';
import {
  Observation,
  ObservationDocument,
} from './entities/observation.entity';
import dayjs from '@/utils/dayjs';
import type { ExpressUser } from '@/utils/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
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

  async update(
    id: string,
    updateObservationDto: UpdateObservationDto,
    user: ExpressUser,
  ): Promise<ObservationDocument> {
    const observation = await this.observationModel.findById(id).exec();
    if (
      observation?.type === ObservationType.RUNNING_NOTES &&
      user.group === 'nurse' &&
      observation.authorUserName !== user.userName
    ) {
      throw new ForbiddenException('Nurses can only edit their own notes.');
    }

    return this.observationModel
      .findByIdAndUpdate(id, updateObservationDto, { returnDocument: 'after' })
      .orFail()
      .exec();
  }

  //Get all observations for a patient
  async getAllObservations(patientId: string): Promise<ObservationDocument[]> {
    return this.observationModel
      .find({ patientId })
      .sort({ createdAt: -1 })
      .exec();
  }

  //Return a specific type of observation found in observation-type.enum
  async getAllSpecificObservationType(
    patientId: string,
    observationType: ObservationType,
  ): Promise<ObservationDocument[]> {
    return this.observationModel
      .find({ patientId, type: observationType })
      .sort({ createdAt: -1 })
      .exec();
  }

  //Return custom period, but date value is needed
  async getObservationByDate(
    patientId: string,
    type: ObservationType,
    startDateStr: string,
    endDateStr: string,
  ): Promise<ObservationDocument[]> {
    //convert provided date to Date object and set 24 hour period
    const start = dayjs.tz(startDateStr).startOf('day').toISOString();
    const end = dayjs.tz(endDateStr).endOf('day').toISOString();

    return this.observationModel
      .find({
        patientId,
        type,
        $or: [
          {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
          {
            dateTime: {
              $gte: start,
              $lte: end,
            },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
