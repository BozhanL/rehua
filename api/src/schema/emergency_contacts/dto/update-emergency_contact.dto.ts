import { CreateEmergencyContactDto } from './create-emergency_contact.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateEmergencyContactDto extends OmitType(
  PartialType(CreateEmergencyContactDto),
  ['patientId'],
) {}
