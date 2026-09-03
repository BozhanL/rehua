'use client';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Table, {
  type TableColumn,
  type TableRow,
} from '@/app/components/common/Table';
import Graph from '@/app/components/observations/Graph';
import {
  OBSERVATION_GRAPH_CONFIG,
  type ObservationType,
  isGraphableObservationType,
} from '@/app/components/observations/observation-graph.config';
import dayjs from '@/app/utils/dayjs';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';
import { useMemo, useState, type ChangeEvent, type JSX } from 'react';

// interface for a table row representing an observation
interface ObservationRow extends TableRow {
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
const observationColumns: TableColumn[] = [
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

// all observation types, including graphable and non-graphable (bowel/urine) types
const OBSERVATION_OPTIONS: ObservationType[] = [
  ...Object.keys(OBSERVATION_GRAPH_CONFIG),
  'BOWEL_OUTPUT',
  'URINE_OUTPUT',
] as ObservationType[];

// mapping of observation types to their dropdown/display labels
function getObservationLabel(type: ObservationType): string {
  if (isGraphableObservationType(type)) {
    const config = OBSERVATION_GRAPH_CONFIG[type];
    return `${config.shortCode} - ${config.label}`;
  }

  return type === 'BOWEL_OUTPUT' ? 'BO - Bowel Output' : 'UO - Urine Output';
}

// TODO: backend delete this and replace with the patient ID
const patientId = '123';

// TODO: backend delete this with the patient's observations
const DEMO_OBSERVATIONS: Observation_idstring[] = [
  {
    patientId: patientId,
    _id: 'OBS-001',
    type: 'OXYGEN_RATE',
    dateTime: dayjs().hour(8).minute(15).second(0).millisecond(0).toISOString(),
    measurementValue: 96,
  },
  {
    patientId: patientId,
    _id: 'OBS-011',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(23)
      .minute(59)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 100,
  },
  {
    patientId: patientId,
    _id: 'OBS-002',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(12)
      .minute(30)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 98,
  },
  {
    patientId: patientId,
    _id: 'OBS-003',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(16)
      .minute(45)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 97,
  },
  {
    patientId: patientId,
    _id: 'OBS-004',
    type: 'HEART_RATE',
    dateTime: dayjs().hour(9).minute(0).second(0).millisecond(0).toISOString(),
    measurementValue: 72,
  },
  {
    patientId: patientId,
    _id: 'OBS-005',
    type: 'HEART_RATE',
    dateTime: dayjs()
      .hour(14)
      .minute(20)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 80,
  },
  {
    patientId: patientId,
    _id: 'OBS-006',
    type: 'BOWEL_OUTPUT',
    dateTime: dayjs()
      .hour(10)
      .minute(15)
      .second(0)
      .millisecond(0)
      .toISOString(),
    notes: 'Normal bowel movement',
  },
  {
    patientId: patientId,
    _id: 'OBS-007',
    type: 'URINE_OUTPUT',
    dateTime: dayjs()
      .hour(13)
      .minute(40)
      .second(0)
      .millisecond(0)
      .toISOString(),
    notes: 'Normal',
  },
];

// function to format the measurement value of an observation for display purposes
// show "-" if the measurement value is undefined, otherwise show the value with its unit
function formatMeasurement(observation: Observation_idstring): string {
  if (observation.measurementValue === undefined) {
    return '—';
  }
  if (!isGraphableObservationType(observation.type)) {
    return String(observation.measurementValue);
  }
  const config = OBSERVATION_GRAPH_CONFIG[observation.type];
  return `${String(observation.measurementValue)} ${config.unit}`;
}

// React component for displaying patient's observations
export function PatientObservations(): JSX.Element {
  // TODO: frontend running notes component/modal state

  // TODO: frontend to change this so that the first observation is running notes
  // selected observation type, defaulting to the first option in OBSERVATION_OPTIONS
  const [selectedObservation, setSelectedObservation] =
    useState<ObservationType>('OXYGEN_RATE');

  // selected date for filtering observations, defaulting to today's date
  const [selectedDate, setSelectedDate] = useState(
    dayjs().tz().format('YYYY-MM-DD'),
  );

  // controls whether observation entries table or graph view is shown for graphable observation types
  const [showEntries, setShowEntries] = useState(false);

  // state for the new measurement input field, used for adding new numeric observations (graphable types only)
  const [newMeasurement, setNewMeasurement] = useState('');

  // TODO: backend modify this and replace with the patient's observations for the selected observation type and date
  const [observations, setObservations] =
    useState<Observation_idstring[]>(DEMO_OBSERVATIONS);

  // filter the observations based on the selected observation type and date
  const filteredObservations = useMemo(() => {
    return observations.filter((observation) => {
      if (observation.type !== selectedObservation) {
        return false;
      }
      return (
        dayjs(observation.dateTime).tz().format('YYYY-MM-DD') ===
        dayjs(selectedDate).tz().format('YYYY-MM-DD')
      );
    });
  }, [observations, selectedObservation, selectedDate]);

  // unique labels from the backend observation enum/data
  const observationLabels = OBSERVATION_OPTIONS.map((type) => {
    return getObservationLabel(type);
  });

  // map each observation label back to its observation type
  const observationTypeByLabel: Record<string, ObservationType> =
    Object.fromEntries(
      OBSERVATION_OPTIONS.map((type) => [getObservationLabel(type), type]),
    );

  // label for the currently selected observation type, used in dropdown and header
  const selectedObservationLabel = useMemo(() => {
    return getObservationLabel(selectedObservation);
  }, [selectedObservation]);

  // determine if the currently selected observation type is graphable or not
  const isGraphable = isGraphableObservationType(selectedObservation);

  // convert the filtered observations into table rows for display in the table component
  const observationRows: ObservationRow[] = useMemo(() => {
    return filteredObservations.map((observation, rowIndex) => {
      return {
        id: rowIndex,
        content: {
          id: observation._id,
          date: dayjs(observation.dateTime).tz().format('dddd, DD/MM/YYYY'),
          time: dayjs(observation.dateTime).tz().format('HH:mm'),
          measurement: formatMeasurement(observation),
          notes: observation.notes ?? '',
        },
      };
    });
  }, [filteredObservations]);

  // TODO: backend modify this to make a POST request to the backend to add a new observation for the patient
  // performs frontend validation and updates the local state with the new observation
  function handleAddGraphableEntry(): void {
    if (
      !isGraphableObservationType(selectedObservation) ||
      newMeasurement.trim() === ''
    ) {
      return;
    }

    // if the measurement is not a finite number, do not add
    const measurement = Number(newMeasurement);
    if (!Number.isFinite(measurement)) {
      return;
    }

    // if the measurement is outside the min/max range for the selected observation type, do not add
    const { min, max } = OBSERVATION_GRAPH_CONFIG[selectedObservation];
    if (measurement < min || measurement > max) {
      return;
    }

    // TODO: backend modify id creation (?) and replace with the backend-generated observation ID
    const newObservation: Observation_idstring = {
      patientId,
      _id: `OBS-ID-${dayjs().tz().format('DD/MM/YYYY')}-${patientId}`,
      type: selectedObservation,
      dateTime: dayjs().toISOString(),
      measurementValue: measurement,
    };

    // local state update to include new observation
    setObservations((current) => [...current, newObservation]);
    setNewMeasurement('');
  }

  // handle dropdown change for selecting a different observation type
  function handleObservationChange(selectedLabels: string[]): void {
    const selectedLabel = selectedLabels[0];
    if (!selectedLabel || selectedLabel === selectedObservationLabel) {
      return;
    }
    const selectedType = observationTypeByLabel[selectedLabel];
    if (selectedType) {
      setSelectedObservation(selectedType);
    }
  }

  // TODO: frontend implement this to open a modal for adding a new non-numeric observation (bowel/urine)
  function handleAddNonGraphableEntry(): void {
    // TODO: frontend implement bowel/urine entry modal opening logic
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-6 p-5">
          {/* observation title */}
          <span className="text-2xl font-bold text-rehua-navy">
            {selectedObservationLabel}
            {' for:'}
            <br />
            {dayjs(selectedDate).tz().format('DD/MM/YYYY')}
          </span>

          {/* observation selector */}
          <div className="shrink-0">
            <DropdownBar
              options={observationLabels}
              defaultText="Observation: "
              width={450}
              size={18}
              labelMode="prefix"
              selectedValues={[selectedObservationLabel]}
              onChange={handleObservationChange}
            />
          </div>

          {/* date filter */}
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="observation-date" style={{ fontSize: 18 }}>
              Filter by date:
            </label>

            <input
              id="observation-date"
              type="date"
              value={selectedDate}
              onChange={(event) => {
                // if the date input is cleared, reset to today's date
                if (!event.target.value) {
                  setSelectedDate(dayjs().tz().format('YYYY-MM-DD'));
                  return;
                }
                // else, set the selected date to the chosen value
                setSelectedDate(event.target.value);
              }}
              className="h-10 rounded-md border px-3"
              style={{ fontSize: 18 }}
            />
          </div>

          {/* Keep the action controls right-aligned in both modes. */}
          <div className="ml-auto flex shrink-0 items-center gap-5">
            {isGraphable && (
              <SingleLineInput
                type="number"
                value={newMeasurement}
                placeholder={`Enter new measurement . . .`}
                style={{ width: 350, height: 40, fontSize: 18 }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNewMeasurement(event.currentTarget.value);
                }}
              />
            )}

            <ContentButton
              text1="Add Entry"
              iconProps={{ name: 'plus', width: 0.8 }}
              backgroundColor="bg-rehua-green"
              textIconGap={0.3}
              verticalPadding={0.27}
              onClick={() => {
                if (isGraphable) {
                  handleAddGraphableEntry();
                } else {
                  handleAddNonGraphableEntry();
                }
              }}
            />

            {isGraphable && (
              <ContentButton
                text1={showEntries ? 'Graph View' : 'See Entries'}
                iconProps={
                  showEntries
                    ? { name: 'piechart', width: 0.8 }
                    : { name: 'clipboard' }
                }
                backgroundColor="bg-rehua-jordy"
                textIconGap={showEntries ? 0.35 : 0.3}
                verticalPadding={showEntries ? 0.29 : 0.22}
                onClick={() => {
                  setShowEntries((current) => !current);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* TODO: frontend implement running notes list + modals  */}

      {/* main observation content; either graph or table */}
      <div className="overflow-x-auto">
        <div className="min-w-350 bg-rehua-white pl-10">
          {isGraphable && !showEntries ? (
            <Graph
              type={selectedObservation}
              data={filteredObservations}
              width={1800}
              height={550}
            />
          ) : (
            <Table
              columns={
                isGraphable
                  ? observationColumns.filter(
                      (column) => column.rowKey !== 'notes',
                    )
                  : observationColumns
              }
              rows={observationRows}
            />
          )}
        </div>
      </div>
    </>
  );
}
