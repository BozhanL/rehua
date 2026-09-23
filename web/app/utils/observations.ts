import type { TableColumn, TableRow } from '../components/common/Table';
import {
  isGraphableObservationType,
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
  type ObservationType,
} from '../components/observations/observation-graph.config';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';

// interface for a table row representing an observation
export interface ObservationRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    id: string;
    date: string;
    time: string;
    measurement: string;
    notes?: string;
  };
}

// table columns for displaying observations in a table
export const observationColumns: TableColumn[] = [
  {
    rowKey: 'id',
    header: 'Entry ID',
    width: 50,
    columnClassName: 'pl-10',
  },
  {
    rowKey: 'date',
    header: 'Date Recorded',
    width: 50,
  },
  {
    rowKey: 'time',
    header: 'Time Recorded',
    width: 50,
  },
  {
    rowKey: 'measurement',
    header: 'Measurement',
    width: 50,
  },
  {
    rowKey: 'notes',
    header: 'Notes & Description',
    width: 50,
  },
];

// frontend-only observation type
export type ObservationViewType = ObservationType | 'RUNNING_NOTES';

// all observation views shown in the dropdown
export const OBSERVATION_OPTIONS: ObservationViewType[] = [
  'RUNNING_NOTES',
  ...Object.keys(OBSERVATION_GRAPH_CONFIG),
  'BOWEL_OUTPUT',
  'URINE_OUTPUT',
] as ObservationViewType[];

// mapping of observation types to their dropdown/display labels
export function getObservationLabel(type: ObservationViewType): string {
  if (type === 'RUNNING_NOTES') {
    return 'Running Notes';
  }

  if (isGraphableObservationType(type)) {
    const config = OBSERVATION_GRAPH_CONFIG[type];
    return `${config.shortCode} - ${config.label}`;
  }

  return type === 'BOWEL_OUTPUT' ? 'BO - Bowel Output' : 'UO - Urine Output';
}

// function to format the measurement value of an observation for display purposes
// show "-" if the measurement value is undefined, otherwise show the value with its unit
export function formatMeasurement(observation: Observation_idstring): string {
  if (observation.measurementValue === undefined) {
    return '—';
  }
  if (!isGraphableObservationType(observation.type)) {
    return String(observation.measurementValue);
  }
  const config = OBSERVATION_GRAPH_CONFIG[observation.type];
  return `${String(observation.measurementValue)} ${config.unit}`;
}

// function to determine if an observation type is graphable
export function isGraphableType(
  type: ObservationViewType,
): type is GraphableObservationType {
  return type !== 'RUNNING_NOTES' && isGraphableObservationType(type);
}

// function to determine if an observation type is non-graphable (bowel or urine output)
export function isNonGraphableType(
  type: ObservationViewType,
): type is 'BOWEL_OUTPUT' | 'URINE_OUTPUT' {
  return type === 'BOWEL_OUTPUT' || type === 'URINE_OUTPUT';
}
