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

@Controller('emergency-contacts')
export class EmergencyContactController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  //Add emergency contact, returns the created object in json
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
      1,
      'John',
      'Doe',
      'Father',
      '0123456789',
      'jd@personalbar.com',
      '123 highstreet',
      'Can be unsupportive',
    ),
  })

  //Get all emergency contacts for a patient
  @TypedRoute.Get(':id')
  async findPatientEmergncyContacts(
    @TypedParam('id') id: string,
  ): Promise<(EmergencyContact & { _id: string })[]> {
    const docs =
      await this.emergencyContactService.getPatientEmergencyContacts(id);

    return docs.map((doc) => ({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...doc.toJSON(),
      _id: doc._id.toString(),
    }));
  }

  //update an emergency contact by their id
  @TypedRoute.Patch(':id')
  async update(
    @Param('id') id: string,
    @TypedBody() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<UpdateWriteOpResult> {
    return this.emergencyContactService.update(id, updateEmergencyContactDto);
  }

  //TODO: API for editing prirority of emergency contacts and check priorities have no duplicates
}
