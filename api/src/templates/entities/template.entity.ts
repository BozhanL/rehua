import type { CreateTemplateDto } from '../dto/create-template.dto';
import { TemplateType, TemplateTypeValues } from './template-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

@Schema()
export class Template {
  @Prop({ required: true, unique: true })
  public templateName: string;

  @Prop({ required: true, type: [String], enum: TemplateTypeValues })
  public templateType: TemplateType[];

  @Prop({ required: true, type: MongoSchema.Types.Map })
  schema: Record<string, unknown>;

  @Prop({ required: true, type: MongoSchema.Types.Map })
  uiSchema: Record<string, unknown>;

  constructor(data: CreateTemplateDto) {
    this.templateName = data.templateName;
    this.templateType = data.templateType;
    this.schema = data.schema;
    this.uiSchema = data.uiSchema;
  }
}

export type TemplateDocument = HydratedDocument<Template>;
export const TemplateSchema = SchemaFactory.createForClass(Template);
