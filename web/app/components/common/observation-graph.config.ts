import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';

// the backend's ObservationType enum, as the SDK surfaces it: nestia inlines
// the enum as a string union on each structure rather than exporting a named
// type, so derive it from the observation structure to stay in sync
export type ObservationType = Observation_idstring['type'];

// BOWEL_OUTPUT and URINE_OUTPUT are the backend's text/notes-based
// observations - they have no numeric measurementValue, so there is nothing to
// plot. Excluding them here means a new numeric type added to the backend enum
// shows up as a missing key in OBSERVATION_GRAPH_CONFIG at compile time.
export type GraphableObservationType = Exclude<
  ObservationType,
  'BOWEL_OUTPUT' | 'URINE_OUTPUT'
>;

export interface ObservationGraphConfig {
  shortCode: string;
  label: string;
  unit: string;
  min: number;
  max: number;
}

// axis ranges/labels/units are presentation concerns the backend doesn't
// model, so they live here - only the set of keys comes from the SDK
export const OBSERVATION_GRAPH_CONFIG: Record<
  GraphableObservationType,
  ObservationGraphConfig
> = {
  OXYGEN_RATE: {
    shortCode: 'SpO2',
    label: 'Oxygen % rate',
    unit: '%',
    min: 65,
    max: 100,
  },
  RESPIRATION_RATE: {
    shortCode: 'RR',
    label: 'Respiration Rate',
    unit: '/minute',
    min: 10,
    max: 25,
  },
  BLOOD_PRESSURE: {
    shortCode: 'BP',
    label: 'Blood Pressure',
    unit: 'mmHg',
    min: 30,
    max: 250,
  },
  HEART_RATE: {
    shortCode: 'HR',
    label: 'Heart Rate (pulse)',
    unit: 'bpm',
    min: 30,
    max: 100,
  },
  TEMPERATURE: {
    shortCode: 'Temp',
    label: 'Temperature',
    unit: '°C',
    min: 30,
    max: 45,
  },
  WEIGHT: {
    shortCode: 'Weight',
    label: 'Weight',
    unit: 'kg',
    min: 20,
    max: 300,
  },
  BLOOD_GLUCOSE_LEVELS: {
    shortCode: 'BGL',
    label: 'Blood Glucose Levels',
    unit: 'mmol/L',
    min: 0,
    max: 50,
  },
  NEUROLOGICAL_OBSERVATION_CHART: {
    shortCode: 'GCS',
    label: 'Neurological Observation Chart',
    unit: 'GCS',
    min: 3,
    max: 15,
  },
} as const;

// narrows an observation type off the wire to one this component can plot
export function isGraphableObservationType(
  type: ObservationType,
): type is GraphableObservationType {
  return Object.hasOwn(OBSERVATION_GRAPH_CONFIG, type);
}
