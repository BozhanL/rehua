import type { ObservationType } from '../entities/observation-type.enum';

export class CreateObservationDto {
  constructor(
    public patientId: string,
    public dateTime: Date,
    public type: ObservationType,
    public measurementValue?: number,
    public notes?: string,
  ) {}
}
