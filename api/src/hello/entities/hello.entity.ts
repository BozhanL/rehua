import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HelloDocument = HydratedDocument<Hello>;

@Schema()
export class Hello {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  content: string;

  constructor(id: string, content: string) {
    this.id = id;
    this.content = content;
  }
}

export const HelloSchema = SchemaFactory.createForClass(Hello);
