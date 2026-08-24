import { EmergencyContactController } from './emergency_contact.controller';
import { EmergencyContactService } from './emergency_contact.service';
import {
  EmergencyContact,
  EmergencyContactSchema,
} from './entities/emergency_contact.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyContact.name, schema: EmergencyContactSchema },
    ]),
  ],
  controllers: [EmergencyContactController],
  providers: [EmergencyContactService],
})
export class EmergencyContactModule {}
