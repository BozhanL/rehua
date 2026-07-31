import { CreateEmergencyContactDto } from './dto/create-emergency_contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency_contact.dto';
import {
  EmergencyContact,
  EmergencyContactDocument,
} from './entities/emergency_contact.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';

@Injectable()
export class EmergencyContactService {
  constructor(
    @InjectModel(EmergencyContact.name)
    private readonly emergencyContactModel: Model<EmergencyContact>,
  ) {}

  async create(
    createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<EmergencyContactDocument> {
    const createdEmergencyContact = new this.emergencyContactModel(
      createEmergencyContactDto,
    );
    return createdEmergencyContact.save();
  }

  //Get all emergency contacts for a patient
  async getPatientEmergencyContacts(
    patientId: string,
  ): Promise<EmergencyContact[]> {
    return this.emergencyContactModel.find({ patientId }).exec();
  }

  //Update an emergency contact
  async update(
    id: string,
    updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<UpdateWriteOpResult> {
    return this.emergencyContactModel
      .updateOne(
        { id },
        {
          $set: updateEmergencyContactDto,
        },
      )
      .exec();
  }

  //to-do: API for editing prirority of emergency contacts and check priorities have no duplicates
}
