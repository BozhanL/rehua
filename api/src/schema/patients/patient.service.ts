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
  ): Promise<PaginatedResponseDto<PatientDocument>> {
    const docs = await this.patientModel
      .find()
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
  ): Promise<PatientDocument[]> {
    const searchFilter: Record<string, unknown> = {};

    if (filter && search) {
      const escapedValue = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

      searchFilter[filter] = {
        $regex: escapedValue,
        $options: 'i',
      };
    }

    const query = searchFilter as QueryFilter<PatientDocument>;

    return this.patientModel
      .find(query)
      .sort({ dateAdmitted: 'desc' })
      .skip((pageNumber - 1) * numberOfRows)
      .limit(numberOfRows)
      .exec();
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
