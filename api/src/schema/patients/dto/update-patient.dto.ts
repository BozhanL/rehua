import { CreatePatientDto } from './create-patient.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
