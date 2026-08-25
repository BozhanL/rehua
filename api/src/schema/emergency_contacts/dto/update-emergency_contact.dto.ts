import { CreateEmergencyContactDto } from './create-emergency_contact.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEmergencyContactDto extends PartialType(
  CreateEmergencyContactDto,
) {}
