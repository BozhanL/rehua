import { ObservationType } from './observation-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ObservationDocument = HydratedDocument<Observation>;

@Schema()
export class Observation {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  })
  patientId: string;

  @Prop({ required: true, type: Date })
  dateTime: Date;

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
    dateTime: Date,
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
