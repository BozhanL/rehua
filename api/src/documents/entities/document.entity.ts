import { Patient } from '@/schema/patients/entities/patient.entity';
import {
  Template,
  TemplateDocument,
} from '@/templates/entities/template.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongoSchema,
  PopulateDocumentResult,
  Types,
} from 'mongoose';

@Schema()
export class FileDocument {
  @Prop({
    required: true,
    type: MongoSchema.Types.ObjectId,
    ref: Patient.name,
  })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  public path: string;

  @Prop({ required: true })
  public fileName: string;

  constructor(patientId: Types.ObjectId, path: string, fileName: string) {
    this.patientId = patientId;
    this.path = path;
    this.fileName = fileName;
  }
}

export type FileDocumentDocument = HydratedDocument<FileDocument>;
export const FileDocumentSchema = SchemaFactory.createForClass(FileDocument);

@Schema()
export class FormDocument {
  @Prop({
    required: true,
    type: MongoSchema.Types.ObjectId,
    ref: Patient.name,
  })
  patientId: Types.ObjectId;

  @Prop({
    required: true,
    type: MongoSchema.Types.ObjectId,
    ref: Template.name,
  })
  public templateId: Types.ObjectId;

  @Prop({ required: true, type: MongoSchema.Types.Map })
  public data: Record<string, unknown>;

  constructor(
    patientId: Types.ObjectId,
    templateId: Types.ObjectId,
    data: Record<string, unknown>,
  ) {
    this.patientId = patientId;
    this.templateId = templateId;
    this.data = data;
  }
}

export type FormDocumentDocument = HydratedDocument<FormDocument>;
export type FormDocumentPopulatedDocument<Paths> = PopulateDocumentResult<
  FormDocumentDocument,
  Paths,
  Omit<FormDocument, 'templateId'> & {
    templateId: TemplateDocument;
  },
  FormDocument
>;
export const FormDocumentSchema = SchemaFactory.createForClass(FormDocument);
