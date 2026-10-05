import type { ObservationType } from '../entities/observation-type.enum';
import type { NoteAuditEntry } from './noteAutditEntity.dto';

export class CreateObservationDto {
  constructor(
    public patientId: string,
    public createdAt: string,
    public type: ObservationType,
    public measurementValue?: number,
    public notes?: string,

    // fields for running notes
    public authorName?: string,
    public authorUserName?: string,
    public plainText?: string,
    public html?: string,
    public lastFormattedBy?: string,
    public lastFormattedAt?: string,
    public auditHistory?: NoteAuditEntry[],
  ) {}
}
