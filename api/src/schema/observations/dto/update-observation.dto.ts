import { CreateObservationDto } from './create-observation.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateObservationDto extends PartialType(CreateObservationDto) {}
