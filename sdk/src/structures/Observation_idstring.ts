export type Observation_idstring = {
  patientId: string;
  dateTime: string;
  type:
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
  _id: string;
};
export namespace Observation_idstring {
  export type o1 = {
    patientId: string;
    dateTime: string;
    type:
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
    _id: string;
  };
  export type o2 = {
    patientId: string;
    dateTime: string;
    type:
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
    _id: string;
  };
}
