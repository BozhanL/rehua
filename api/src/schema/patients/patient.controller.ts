import type { CreatePatientDto } from './dto/create-patient.dto';
import type { PatientPageQueryDto } from './dto/pagination-request.dto';
import { PaginatedResponseDto } from './dto/pagination-response.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createPatientDto: CreatePatientDto,
  ): Promise<Patient & { _id: string }> {
    const doc = await this.patientService.create(createPatientDto);

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @TypedRoute.Get()
  async findAll(): Promise<(Patient & { _id: string })[]> {
    const docs = await this.patientService.findAll();

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  @SwaggerExample.Response('Found', {
    value: new Patient(
      'John',
      'Doe',
      '1990-07-21',
      '123 street, city, suburb',
      '1234567',
      '2026-06-20',
      'David at Main Hospital',
      'Sarah Smith',
      'A123',
      'longTerm',
      'email@domain.com',
      '+64 123 456789',
      'Male',
      'English',
      'Married',
      'Kiwi',
      'Nuts',
    ),
  })
  @SwaggerExample.Response('Not found', { value: null })
  @TypedRoute.Get(':id')
  async findOne(
    @TypedParam('id') id: string,
  ): Promise<(Patient & { _id: string }) | null> {
    const doc = await this.patientService.findOne(id);

    const formattedDoc = doc
      ? {
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          ...doc.toJSON(),
          _id: doc._id.toString(),
        }
      : null;

    return formattedDoc;
  }

  //returns patients like in a the list view (number of results shown, page number)
  //optional filters
  @TypedRoute.Get('page/:pageNumber/:numberOfRows')
  async findPage(
    @TypedParam('numberOfRows') numberOfRows: number,
    @TypedParam('pageNumber') pageNumber: number,
    @TypedQuery() query: PatientPageQueryDto,
  ): Promise<PaginatedResponseDto<Patient & { _id: string }>> {
    const { filter, search } = query;

    let paginatedResult;

    if (filter || search) {
      paginatedResult = await this.patientService.findPageByFilter(
        numberOfRows,
        pageNumber,
        filter ?? '',
        search ?? '',
      );
    } else {
      paginatedResult = await this.patientService.findPage(
        numberOfRows,
        pageNumber,
      );
    }

    const formattedDocs = paginatedResult.data.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));

    return {
      data: formattedDocs,
      meta: paginatedResult.meta,
    };
  }

  @TypedRoute.Patch(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdateWriteOpResult> {
    return this.patientService.update(id, updatePatientDto);
  }
}
