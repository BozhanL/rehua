'use client';

import DropdownBar from '@/app/components/common/DropdownBar';
import Graph from '@/app/components/observations/Graph';
import {
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
} from '@/app/components/observations/observation-graph.config';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';
import { useState, type JSX } from 'react';

// stable option order, derived from the config so a new observation type
// only ever needs to be added in one place
const OBSERVATION_TYPES = Object.keys(
  OBSERVATION_GRAPH_CONFIG,
) as GraphableObservationType[];

// DropdownBar displays each type's human-readable label, this maps back to
// the underlying GraphableObservationType key when an option is selected
const TYPE_BY_LABEL = new Map<string, GraphableObservationType>(
  OBSERVATION_TYPES.map((type) => [OBSERVATION_GRAPH_CONFIG[type].label, type]),
);

/* -------------------------------------------------------------------------- */
/* Fake data, for the demo only.                                              */
/*                                                                            */
/* It's typed as the SDK's Observation_idstring, which is exactly what a real  */
/* call to observations.findByType gives back - dates as ISO strings, and      */
/* measurementValue optional. That means it can be handed to Graph untouched,  */
/* the same way real data would be, so this page exercises the real path with  */
/* fixed numbers instead of a live patient record.                            */
/* -------------------------------------------------------------------------- */

const DEMO_PATIENT_ID = 'demo-patient-0001';
const DEMO_DATE = '2026-08-24';

function isoDateTime(hour: number, minute: number): string {
  return `${DEMO_DATE}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

// times are deliberately not on the hour (08:14, 13:36...) so the demo proves
// Graph places readings anywhere along the x-axis, not just on hour marks.
type TimedReading = [hour: number, minute: number, measurementValue?: number];

function buildDtoSeries(
  type: GraphableObservationType,
  readings: TimedReading[],
): Observation_idstring[] {
  return readings.map(([hour, minute, measurementValue], index) => ({
    _id: `${DEMO_PATIENT_ID}-${type}-${String(index)}`,
    patientId: DEMO_PATIENT_ID,
    dateTime: isoDateTime(hour, minute),
    type,
    // exactOptionalPropertyTypes forbids an explicit `undefined` - omit the
    // key entirely for notes-only readings rather than setting it to undefined
    ...(measurementValue === undefined ? {} : { measurementValue }),
  }));
}

// one series of fake readings per observation type. Some entries are bad on
// purpose - see the comments inline - to show what Graph filters out.
const DEMO_OBSERVATIONS: Record<
  GraphableObservationType,
  Observation_idstring[]
> = {
  OXYGEN_RATE: buildDtoSeries('OXYGEN_RATE', [
    [0, 47, 97],
    [4, 22, 96],
    [8, 14, 95],
    [11, 47, 999], // out of range (max 100) - dropped by Graph
    [13, 36, 94.5],
    [16, 9, 94],
    [19, 52, 96],
    [22, 38, 97],
  ]),
  RESPIRATION_RATE: buildDtoSeries('RESPIRATION_RATE', [
    [0, 47, 16],
    [4, 22, 15],
    [8, 14, 18],
    [11, 47, -5], // out of range (min 10) - dropped by Graph
    [13, 36, 17.5],
    [16, 9, 17],
    [19, 52, 16],
    [22, 38, 15],
  ]),
  BLOOD_PRESSURE: buildDtoSeries('BLOOD_PRESSURE', [
    [0, 47, 120],
    [4, 22, 118],
    [8, 14, 125],
    [11, 47, 400], // out of range (max 250) - dropped by Graph
    [13, 36, 128],
    [16, 9, 130],
    [19, 52, 122],
    [22, 38, 119],
  ]),
  HEART_RATE: buildDtoSeries('HEART_RATE', [
    [0, 47, 72],
    [4, 22, 68],
    [8, 14, 75],
    [11, 47, 150], // out of range (max 100) - dropped by Graph
    [13, 36, 78],
    [15, 30], // no measurementValue (notes-only observation) - dropped by the adapter, before Graph
    [16, 9, 80],
    [19, 52, 74],
    [22, 38, 70],
  ]),
  TEMPERATURE: buildDtoSeries('TEMPERATURE', [
    [0, 47, 36.8],
    [4, 22, 36.5],
    [8, 14, 37.0],
    [11, 47, 50], // out of range (max 45) - dropped by Graph
    [13, 36, 37.1],
    [16, 9, 37.2],
    [19, 52, 36.9],
    [22, 38, 36.7],
  ]),
  WEIGHT: buildDtoSeries('WEIGHT', [
    [0, 47, 70],
    [4, 22, 70],
    [8, 14, 70],
    [11, 47, -10], // out of range (min 20) - dropped by Graph
    [13, 36, 70],
    [16, 9, 70],
    [19, 52, 70],
    [22, 38, 70],
  ]),
  BLOOD_GLUCOSE_LEVELS: buildDtoSeries('BLOOD_GLUCOSE_LEVELS', [
    [0, 47, 5.5],
    [4, 22, 4.8],
    [8, 14, 7.2],
    [11, 47, 99], // out of range (max 50) - dropped by Graph
    [13, 36, 6.1],
    [16, 9, 6.5],
    [19, 52, 5.9],
    [22, 38, 5.2],
  ]),
  NEUROLOGICAL_OBSERVATION_CHART: buildDtoSeries(
    'NEUROLOGICAL_OBSERVATION_CHART',
    [
      [0, 47, 15],
      [4, 22, 15],
      [8, 14, 14],
      [11, 47, 20], // out of range (max 15) - dropped by Graph
      [13, 36, 15],
      [16, 9, 15],
      [19, 52, 15],
      [22, 38, 15],
    ],
  ),
};

function GraphDemo(): JSX.Element {
  const [selectedType, setSelectedType] =
    useState<GraphableObservationType>('HEART_RATE');

  const config = OBSERVATION_GRAPH_CONFIG[selectedType];

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <h2 className="text-3xl font-bold text-rehua-maroon">
        Graph Demonstration
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-rehua-dark-gray">Observation type:</span>
        <DropdownBar
          options={OBSERVATION_TYPES.map(
            (type) => OBSERVATION_GRAPH_CONFIG[type].label,
          )}
          selectedValues={[OBSERVATION_GRAPH_CONFIG[selectedType].label]}
          onChange={(newValues) => {
            const label = newValues[0];
            const type =
              label === undefined ? undefined : TYPE_BY_LABEL.get(label);
            if (type !== undefined) {
              setSelectedType(type);
            }
          }}
          defaultText="Select observation"
          width={260}
        />
      </div>

      <div
        className="
          rounded-3xl border border-rehua-maroon/20 bg-rehua-white/90 p-6
        "
      >
        <h3 className="mb-4 text-xl font-semibold text-rehua-navy">
          {config.label}
        </h3>
        <Graph type={selectedType} data={DEMO_OBSERVATIONS[selectedType]} />
        <p className="mt-2 text-xs text-rehua-dark-gray">
          Graph example using mock observation schema. Component drops
          value-less observations before Graph ever sees them.
        </p>
      </div>
    </section>
  );
}

export default GraphDemo;
