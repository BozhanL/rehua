import type { NoteAuditEntry } from './NoteAuditEntry';

export type UpdateObservationDto = {
  type?:
    | undefined
    | 'RUNNING_NOTES'
    | 'OXYGEN_RATE'
    | 'RESPIRATION_RATE'
    | 'BLOOD_PRESSURE'
    | 'HEART_RATE'
    | 'TEMPERATURE'
    | 'WEIGHT'
    | 'BLOOD_GLUCOSE_LEVELS'
    | 'NEUROLOGICAL_OBSERVATION_CHART'
    | 'BOWEL_OUTPUT'
    | 'URINE_OUTPUT';
  notes?: undefined | string;
  createdAt?: undefined | string;
  measurementValue?: undefined | number;
  authorName?: undefined | string;
  plainText?: undefined | string;
  html?: undefined | string;
  lastFormattedBy?: undefined | string;
  lastFormattedAt?: undefined | string;
  auditHistory?: undefined | NoteAuditEntry[];
};
