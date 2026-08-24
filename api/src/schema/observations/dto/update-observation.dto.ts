import { CreateObservationDto } from './create-observation.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateObservationDto extends OmitType(
  PartialType(CreateObservationDto),
  ['patientId'],
) {}
