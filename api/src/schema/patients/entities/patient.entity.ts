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
  dateOfBirth: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  nhi: string;

  @Prop({ type: String, required: true })
  dateAdmitted: string;

  @Prop({ type: String, required: true })
  gpNameAndMedicalCenter: string;

  @Prop({ type: String, required: true })
  nurse: string;

  @Prop({ type: String, required: true })
  roomNumber: string;

  @Prop({ type: String, required: true })
  status:
    | 'active'
    | 'disabled'
    | 'longTerm'
    | 'palliative'
    | 'shortTerm'
    | 'daycare'
    | 'discharged'
    | 'deceased'
    | 'upload';

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
  profilePicture?: string | undefined; //not required

  @Prop({ type: String, required: false })
  funding: string | undefined; //not required, admin only

  @Prop({ type: String, required: false })
  timeOfDeath: string | undefined; //not required, admin only

  constructor(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    address: string,
    nhi: string,
    dateAdmitted: string,
    gpNameAndMedicalCenter: string,
    nurse: string,
    roomNumber: string,
    status:
      | 'active'
      | 'disabled'
      | 'longTerm'
      | 'palliative'
      | 'shortTerm'
      | 'daycare'
      | 'discharged'
      | 'deceased'
      | 'upload',
    email: string,
    homePhoneNumber: string,
    gender: string,
    primaryLanguage: string,
    maritalStatus: string,
    ethnicity: string,
    allergies: string,

    //Not required
    profilePicture?: string,
    funding?: string, //Admin only
    timeOfDeath?: string, //Admin only
  ) {
    this.profilePicture = profilePicture;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.timeOfDeath = timeOfDeath;
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
