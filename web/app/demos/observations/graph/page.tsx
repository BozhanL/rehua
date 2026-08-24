'use client';

import DropdownBar from '@/app/components/common/DropdownBar';
import Graph, { type GraphDataPoint } from '@/app/components/common/Graph';
import {
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
} from '@/app/components/common/observation-graph.config';
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
/* Demo-only hardcoded data                                                   */
/* In the real app, GraphDataPoint[] would come from the backend per patient. */
/* Each series includes one intentionally out-of-range reading at hour 12,    */
/* to demonstrate Graph silently dropping invalid/out-of-range points.        */
/* -------------------------------------------------------------------------- */

const DEMO_DATE = '2026-08-24';

function hourlyPoint(hour: number, value: number): GraphDataPoint {
  return {
    hour,
    value,
    dateTime: new Date(
      `${DEMO_DATE}T${String(hour).padStart(2, '0')}:00:00.000Z`,
    ),
  };
}

const DEMO_DATA: Record<GraphableObservationType, GraphDataPoint[]> = {
  OXYGEN_RATE: [
    hourlyPoint(0, 97),
    hourlyPoint(4, 96),
    hourlyPoint(8, 95),
    hourlyPoint(12, 999), // out of range (max 100) - dropped
    hourlyPoint(16, 94),
    hourlyPoint(20, 96),
    hourlyPoint(23, 97),
  ],
  RESPIRATION_RATE: [
    hourlyPoint(0, 16),
    hourlyPoint(4, 15),
    hourlyPoint(8, 18),
    hourlyPoint(12, -5), // out of range (min 10) - dropped
    hourlyPoint(16, 17),
    hourlyPoint(20, 16),
    hourlyPoint(23, 15),
  ],
  BLOOD_PRESSURE: [
    hourlyPoint(0, 120),
    hourlyPoint(4, 118),
    hourlyPoint(8, 125),
    hourlyPoint(12, 400), // out of range (max 250) - dropped
    hourlyPoint(16, 130),
    hourlyPoint(20, 122),
    hourlyPoint(23, 119),
  ],
  HEART_RATE: [
    hourlyPoint(0, 72),
    hourlyPoint(4, 68),
    hourlyPoint(8, 75),
    hourlyPoint(12, 150), // out of range (max 100) - dropped
    hourlyPoint(16, 80),
    hourlyPoint(20, 74),
    hourlyPoint(23, 70),
  ],
  TEMPERATURE: [
    hourlyPoint(0, 36.8),
    hourlyPoint(4, 36.5),
    hourlyPoint(8, 37.0),
    hourlyPoint(12, 50), // out of range (max 45) - dropped
    hourlyPoint(16, 37.2),
    hourlyPoint(20, 36.9),
    hourlyPoint(23, 36.7),
  ],
  WEIGHT: [
    hourlyPoint(0, 70),
    hourlyPoint(4, 70),
    hourlyPoint(8, 70),
    hourlyPoint(12, -10), // out of range (min 20) - dropped
    hourlyPoint(16, 70),
    hourlyPoint(20, 70),
    hourlyPoint(23, 70),
  ],
  BLOOD_GLUCOSE_LEVELS: [
    hourlyPoint(0, 5.5),
    hourlyPoint(4, 4.8),
    hourlyPoint(8, 7.2),
    hourlyPoint(12, 99), // out of range (max 50) - dropped
    hourlyPoint(16, 6.5),
    hourlyPoint(20, 5.9),
    hourlyPoint(23, 5.2),
  ],
  NEUROLOGICAL_OBSERVATION_CHART: [
    hourlyPoint(0, 15),
    hourlyPoint(4, 15),
    hourlyPoint(8, 14),
    hourlyPoint(12, 20), // out of range (max 15) - dropped
    hourlyPoint(16, 15),
    hourlyPoint(20, 15),
    hourlyPoint(23, 15),
  ],
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
        <Graph type={selectedType} data={DEMO_DATA[selectedType]} />
        <p className="mt-2 text-xs text-rehua-dark-gray">
          The hour-12 reading in this demo&apos;s hardcoded data is
          intentionally out of range ({config.min}-{config.max} {config.unit})
          to show that Graph drops invalid readings instead of plotting them.
        </p>
      </div>
    </section>
  );
}

export default GraphDemo;
