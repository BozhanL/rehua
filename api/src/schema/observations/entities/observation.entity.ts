import { NoteAuditEntry } from '../dto/noteAutditEntity.dto';
import { ObservationType } from './observation-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObservationDocument = HydratedDocument<Observation>;

@Schema()
export class Observation {
  @Prop({ required: true, type: String })
  patientId: string;

  @Prop({ required: true, type: String })
  createdAt: string;

  @Prop({ type: String })
  dateTime?: string | undefined;

  @Prop({ required: true, type: String, enum: ObservationType })
  type: ObservationType;

  //numrical messurements
  @Prop({ type: Number })
  measurementValue?: number | undefined;

  //nonnmrical messurements
  @Prop({ type: String })
  notes?: string | undefined;

  @Prop({ type: String })
  authorName?: string | undefined;

  @Prop({ type: String })
  authorUserName?: string | undefined;

  @Prop({ type: String })
  plainText?: string | undefined;

  @Prop({ type: String })
  html?: string | undefined;

  @Prop({ type: String })
  lastFormattedBy?: string | undefined;

  @Prop({ type: String })
  lastFormattedAt?: string | undefined;

  @Prop({ type: NoteAuditEntry })
  auditHistory?: NoteAuditEntry[] | undefined;

  constructor(
    patientId: string,
    createdAt: string,
    type: ObservationType,
    measurementValue?: number,
    notes?: string,
    authorName?: string,
    plainText?: string,
    html?: string,
    lastFormattedBy?: string,
    lastFormattedAt?: string,
    auditHistory?: NoteAuditEntry[],
  ) {
    this.patientId = patientId;
    this.createdAt = createdAt;
    this.type = type;
    this.measurementValue = measurementValue;
    this.notes = notes;
    this.authorName = authorName;
    this.plainText = plainText;
    this.html = html;
    this.lastFormattedBy = lastFormattedBy;
    this.lastFormattedAt = lastFormattedAt;
    this.auditHistory = auditHistory;
  }
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);
