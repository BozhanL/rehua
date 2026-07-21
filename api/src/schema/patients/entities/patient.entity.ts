import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dob: Date;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  nhi: number;

  @Prop({ required: true })
  dateAdmitted: Date;

  @Prop({ required: true })
  gpNameAndMedicalCenter: string;

  @Prop({ required: true })
  nurse: string;

  @Prop({ required: true })
  roomNumber: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  homePhoneNumber: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  primaryLanguage: string;

  @Prop({ required: true })
  maritalStatus: string;

  @Prop({ required: true })
  ethnicity: string;

  @Prop({ required: true })
  allergies: string;

  @Prop()
  pfp?: string | undefined; //not required

  @Prop()
  funding: string | undefined; //not required, admin only

  @Prop()
  tod: string | undefined; //not required, admin only

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    dob: Date,
    address: string,
    nhi: number,
    dateAdmitted: Date,
    gpNameAndMedicalCenter: string,
    nurse: string,
    roomNumber: number,
    status: string,
    email: string,
    homePhoneNumber: string,
    gender: string,
    primaryLanguage: string,
    maritalStatus: string,
    ethnicity: string,
    allergies: string,

    //Not required
    pfp?: string,
    funding?: string, //Admin only
    tod?: string, //Admin only
  ) {
    this.id = id;
    this.pfp = pfp;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.tod = tod;
    this.address = address;
    this.nhi = nhi;
    this.dateAdmitted = dateAdmitted;
    this.gpNameAndMedicalCenter = gpNameAndMedicalCenter;
    this.nurse = nurse;
    this.roomNumber = roomNumber;
    this.status = status;
    this.funding = funding;
    this.email = email;
    this.homePhoneNumber = homePhoneNumber;
    this.gender = gender;
    this.primaryLanguage = primaryLanguage;
    this.maritalStatus = maritalStatus;
    this.ethnicity = ethnicity;
    this.allergies = allergies;
  }
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
