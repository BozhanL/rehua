import { CreateEmergencyContactDto } from './dto/create-emergency_contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency_contact.dto';
import { EmergencyContactService } from './emergency_contact.service';
import { EmergencyContact } from './entities/emergency_contact.entity';
import {
  SwaggerExample,
  TypedBody,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Controller, Param } from '@nestjs/common';
import { UpdateWriteOpResult } from 'mongoose';

@Controller('patients/:id/emergency-contacts')
export class EmergencyContactController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  @TypedRoute.Post()
  async create(
    @TypedBody() createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact & { _id: string }> {
    const doc = await this.emergencyContactService.create(
      createEmergencyContactDto,
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    };
  }

  @SwaggerExample.Response('Found', {
    value: new EmergencyContact(
      'ACB123',
      'John',
      'Doe',
      'Father',
      '0123456789',
      'jd@personalbar.com',
      '123 highstreet',
      'Can be unsupportive',
    ),
  })
  @TypedRoute.Get()
  async findPatientEmergncyContacts(
    @TypedParam('id') id: string,
  ): Promise<EmergencyContact[]> {
    return this.emergencyContactService.getPatientEmergencyContacts(id);
  }

  @TypedRoute.Patch('id')
  async update(
    @Param('id') id: string,
    @TypedBody() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<UpdateWriteOpResult> {
    return this.emergencyContactService.update(id, updateEmergencyContactDto);
  }
}
