import type { CreateTemplateDto } from '../dto/create-template.dto';
import { TemplateType, TemplateTypeValues } from './template-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

@Schema()
export class Template {
  @Prop({ required: true, type: MongoSchema.Types.Int32 })
  public version: number;

  @Prop({ required: true })
  public templateName: string;

  @Prop({ required: true, type: [String], enum: TemplateTypeValues })
  public templateType: TemplateType[];

  @Prop({ required: true, type: MongoSchema.Types.Map })
  schema: Record<string, unknown>;

  @Prop({ required: true, type: MongoSchema.Types.Map })
  uiSchema: Record<string, unknown>;

  constructor(version: number, data: CreateTemplateDto) {
    this.version = version;
    this.templateName = data.templateName;
    this.templateType = data.templateType;
    this.schema = data.schema;
    this.uiSchema = data.uiSchema;
  }
}

export type TemplateDocument = HydratedDocument<Template>;
export const TemplateSchema = SchemaFactory.createForClass(Template);

// Make a compound unique index to ensure that the combination of templateName and version is unique
TemplateSchema.index(
  { templateName: 'asc', version: 'desc' },
  { unique: true },
);
