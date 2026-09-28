import type { CreatePatientDto } from './dto/create-patient.dto';
import { PaginatedResponseDto } from './dto/pagination-response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './entities/patient.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
    const createdPatient = new this.patientModel(createPatientDto);
    return createdPatient.save();
  }

  async findAll(): Promise<PatientDocument[]> {
    return this.patientModel.find().sort({ _id: 1 }).exec();
  }

  async findOne(id: string): Promise<PatientDocument | null> {
    return this.patientModel.findOne({ _id: id }).exec();
  }

  async findPage(
    numberOfRows: number,
    pageNumber: number,
    userGroup: string,
  ): Promise<PaginatedResponseDto<PatientDocument>> {
    const searchFilter: Record<string, unknown> = {};

    if (userGroup === 'nurse') {
      searchFilter['status'] = { $ne: 'deceased' };
    }

    const docs = await this.patientModel
      .find(searchFilter)
      .sort({ dateAdmitted: 'desc' })
      .skip((pageNumber - 1) * numberOfRows)
      .limit(numberOfRows)
      .exec();

    const totalDocuments = await this.patientModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / numberOfRows);

    return {
      data: docs,
      meta: {
        totalPages,
      },
    };
  }

  async findPageByFilter(
    numberOfRows: number,
    pageNumber: number,
    filter: string,
    search: string,
    userGroup: string,
  ): Promise<PaginatedResponseDto<PatientDocument>> {
    const searchFilter: Record<string, unknown> = {};

    if (userGroup === 'nurse') {
      searchFilter['status'] = { $ne: 'deceased' };
    }

    if (filter && search) {
      const escapedValue = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

      searchFilter[filter] = {
        $regex: escapedValue,
        $options: 'i',
      };
    }

    const query = searchFilter as QueryFilter<PatientDocument>;

    interface PatientAggregateResult {
      data: PatientDocument[];
      total: number;
    }

    const [result] = await this.patientModel
      .aggregate<PatientAggregateResult>([
        { $match: query },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            paginatedResults: [
              { $sort: { dateAdmitted: -1 } },
              { $skip: (pageNumber - 1) * numberOfRows },
              { $limit: numberOfRows },
            ],
          },
        },
        {
          $project: {
            data: '$paginatedResults',
            total: { $ifNull: [{ $arrayElemAt: ['$totalCount.count', 0] }, 0] },
          },
        },
      ])
      .exec();

    const rawData = result?.data ?? [];
    const total = result?.total ?? 0;

    // rehydrate the raw objects into full Mongoose documents, to allow contorller to add _id
    const data = rawData.map((doc) => this.patientModel.hydrate(doc));

    const totalFilteredDocuments = total;
    const totalPages = Math.ceil(totalFilteredDocuments / numberOfRows);

    return {
      data: data,
      meta: {
        totalPages,
      },
    };
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<UpdateWriteOpResult> {
    return this.patientModel
      .updateOne(
        { _id: id },
        {
          $set: updatePatientDto,
        },
      )
      .exec();
  }
}
