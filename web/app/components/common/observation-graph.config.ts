// TODO:
//import sdk type for observations once schema pr is merged
export type GraphableObservationType =
  | 'OXYGEN_RATE'
  | 'RESPIRATION_RATE'
  | 'BLOOD_PRESSURE'
  | 'HEART_RATE'
  | 'TEMPERATURE'
  | 'WEIGHT'
  | 'BLOOD_GLUCOSE_LEVELS'
  | 'NEUROLOGICAL_OBSERVATION_CHART';

// this one is fine to keep
export interface ObservationGraphConfig {
  shortCode: string;
  label: string;
  unit: string;
  min: number;
  max: number;
}
// TODO:
//replace with sdk type for observations once schema pr is merged
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
