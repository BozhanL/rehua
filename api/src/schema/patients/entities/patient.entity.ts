import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type PatientDocument = HydratedDocument<Patient>;

@Schema()
export class Patient {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  dob: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: Number, required: true })
  nhi: number;

  @Prop({ type: String, required: true })
  dateAdmitted: string;

  @Prop({ type: String, required: true })
  gpNameAndMedicalCenter: string;

  @Prop({ type: String, required: true })
  nurse: string;

  @Prop({ type: Number, required: true })
  roomNumber: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  homePhoneNumber: string;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  primaryLanguage: string;

  @Prop({ type: String, required: true })
  maritalStatus: string;

  @Prop({ type: String, required: true })
  ethnicity: string;

  @Prop({ type: String, required: true })
  allergies: string;

  @Prop({ type: String, required: false })
  pfp?: string | undefined; //not required

  @Prop({ type: String, required: false })
  funding: string | undefined; //not required, admin only

  @Prop({ type: String, required: false })
  tod: string | undefined; //not required, admin only

  constructor(
    firstName: string,
    lastName: string,
    dob: string,
    address: string,
    nhi: number,
    dateAdmitted: string,
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
