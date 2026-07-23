import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {
  @Prop({ required: true, type: Types.Map })
  schema: Record<string, unknown>;

  @Prop({ required: true, type: Types.Map })
  uiSchema: Record<string, unknown>;

  constructor(
    schema: Record<string, unknown>,
    uiSchema: Record<string, unknown>,
  ) {
    this.schema = schema;
    this.uiSchema = uiSchema;
  }
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
