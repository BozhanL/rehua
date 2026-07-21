import type { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Controller, Param } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('Patient')
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
  async findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @TypedRoute.Get(':id')
  @SwaggerExample.Response('Found', {
    value: new Patient(
      '1',
      'John',
      'Doe',
      new Date('1990-07-21'),
      '123 street, city, suburb',
      1234567,
      new Date('2026-06-20'),
      'David at Main Hospital',
      'Sarah Smith',
      123,
      'long term',
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
  async findOne(@TypedParam('id') id: string): Promise<Patient | null> {
    return this.patientService.findOne(id);
  }

  @TypedRoute.Patch(':id')
  async update(
    @Param('id') id: string,
    @TypedBody() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdateWriteOpResult> {
    return this.patientService.update(id, updatePatientDto);
  }
}
