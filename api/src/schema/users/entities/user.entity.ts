import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  status: 'active' | 'disabled';

  @Prop({ required: true })
  homePhoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  group: 'admin' | 'nurse';

  constructor(
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    status: 'active' | 'disabled',
    homePhoneNumber: string,
    address: string,
    group: 'admin' | 'nurse',
  ) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.status = status;
    this.homePhoneNumber = homePhoneNumber;
    this.address = address;
    this.group = group;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
