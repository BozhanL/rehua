import { Patient } from '@/schema/patients/entities/patient.entity';
import { TemplateType } from '@/templates/entities/template-type.enum';
import { Template } from '@/templates/entities/template.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongoSchema,
  PopulateDocumentResult,
  Types,
} from 'mongoose';

export enum DocumentState {
  Current = 'Current',
  Archive = 'Archive',
}

export enum DocumentType {
  LongTerm = 'Long Term',
  ShortTerm = 'Short Term',
  Palliative = 'Palliative',
  Daycare = 'Daycare',
  Upload = 'Upload',
}

DocumentType satisfies {
  [K in keyof typeof TemplateType]: `${(typeof TemplateType)[K]}`;
};

@Schema()
export class FileDocument {
  @Prop({
    required: true,
    type: MongoSchema.Types.ObjectId,
    ref: Patient.name,
  })
  patientId!: Types.ObjectId;

  @Prop({ required: true })
  public tags!: string[];

  @Prop({ required: true })
  public creationDate!: Date;

  @Prop({ required: true })
  public editDate!: Date;

  @Prop({ required: true, type: String, enum: DocumentState })
  public state!: DocumentState;

  @Prop({ required: true, type: String, enum: DocumentType })
  public documentType!: DocumentType;

  @Prop({ required: true })
  public path!: string;

  @Prop({ required: true })
  public fileName!: string;
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
  patientId!: Types.ObjectId;

  @Prop({ required: true })
  public tags!: string[];

  @Prop({ required: true })
  public creationDate!: Date;

  @Prop({ required: true })
  public editDate!: Date;

  @Prop({ required: true, type: String, enum: DocumentState })
  public state!: DocumentState;

  @Prop({ required: true, type: String, enum: DocumentType })
  public documentType!: DocumentType;

  @Prop({
    required: true,
    type: MongoSchema.Types.ObjectId,
    ref: Template.name,
  })
  public templateId!: Types.ObjectId;

  @Prop({ required: true, type: MongoSchema.Types.Map })
  public data!: Record<string, unknown>;
}

export type FormDocumentDocument = HydratedDocument<FormDocument>;
export type FormDocumentPopulatedDocument<Paths> = PopulateDocumentResult<
  FormDocumentDocument,
  Paths,
  Omit<FormDocument, 'templateId'> & Paths,
  FormDocument
>;
export const FormDocumentSchema = SchemaFactory.createForClass(FormDocument);
