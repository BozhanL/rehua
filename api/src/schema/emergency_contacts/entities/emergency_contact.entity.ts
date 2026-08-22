import { ObservationSchema } from '@/schema/observations/entities/observation.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmergencyContactDocument = HydratedDocument<EmergencyContact>;

@Schema()
export class EmergencyContact {
  @Prop({ required: true, type: String })
  patientId: string;

  @Prop({ required: true, type: Number })
  priority: number;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ required: true, type: String })
  relationship: string;

  @Prop({ required: true, type: String })
  phoneNumber: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: String })
  notes?: string | undefined;

  constructor(
    patientId: string,
    priority: number,
    firstName: string,
    lastName: string,
    relationship: string,
    phoneNumber: string,
    email: string,
    address: string,
    notes?: string,
  ) {
    this.patientId = patientId;
    this.priority = priority;
    this.firstName = firstName;
    this.lastName = lastName;
    this.relationship = relationship;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.address = address;
    this.notes = notes;
  }
}

export const EmergencyContactSchema =
  SchemaFactory.createForClass(EmergencyContact);

ObservationSchema.index({ PatientId: 1 });
