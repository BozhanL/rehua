import { ObservationType } from './observation-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ObservationDocument = HydratedDocument<Observation>;

@Schema()
export class Observation {
  @Prop({ required: true, type: String })
  patientId: string;

  @Prop({ required: true, type: String })
  dateTime: string;

  @Prop({ required: true, type: String, enum: ObservationType })
  type: ObservationType;

  //numrical messurements
  @Prop({ type: Number })
  measurementValue?: number | undefined;

  //nonnmrical messurements
  @Prop({ type: String })
  notes?: string | undefined;

  constructor(
    patientId: string,
    dateTime: string,
    type: ObservationType,
    measurementValue?: number,
    notes?: string,
  ) {
    this.patientId = patientId;
    this.dateTime = dateTime;
    this.type = type;
    this.measurementValue = measurementValue;
    this.notes = notes;
  }
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);

ObservationSchema.index({ patientId: 1, dateTime: -1 });
