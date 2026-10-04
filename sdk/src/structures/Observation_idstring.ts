import type { NoteAuditEntry } from './NoteAuditEntry';

export type Observation_idstring = {
  patientId: string;
  createdAt: string;
  type:
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
  measurementValue?: undefined | number;
  notes?: undefined | string;
  authorName?: undefined | string;
  plainText?: undefined | string;
  html?: undefined | string;
  lastFormattedBy?: undefined | string;
  lastFormattedAt?: undefined | string;
  auditHistory?: undefined | NoteAuditEntry[];
  _id: string;
};
export namespace Observation_idstring {
  export type o1 = {
    patientId: string;
    createdAt: string;
    type:
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
    measurementValue?: undefined | number;
    notes?: undefined | string;
    authorName?: undefined | string;
    plainText?: undefined | string;
    html?: undefined | string;
    lastFormattedBy?: undefined | string;
    lastFormattedAt?: undefined | string;
    auditHistory?: undefined | NoteAuditEntry[];
    _id: string;
  };
  export type o2 = {
    patientId: string;
    createdAt: string;
    type:
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
    measurementValue?: undefined | number;
    notes?: undefined | string;
    authorName?: undefined | string;
    plainText?: undefined | string;
    html?: undefined | string;
    lastFormattedBy?: undefined | string;
    lastFormattedAt?: undefined | string;
    auditHistory?: undefined | NoteAuditEntry[];
    _id: string;
  };
  export type o3 = {
    patientId: string;
    createdAt: string;
    type:
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
    measurementValue?: undefined | number;
    notes?: undefined | string;
    authorName?: undefined | string;
    plainText?: undefined | string;
    html?: undefined | string;
    lastFormattedBy?: undefined | string;
    lastFormattedAt?: undefined | string;
    auditHistory?: undefined | NoteAuditEntry[];
    _id: string;
  };
}
