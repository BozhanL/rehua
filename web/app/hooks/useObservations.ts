import {
  DEMO_OBSERVATIONS,
  patientId,
} from '../(pages)/patients/profile/tempobservationsdata';
import {
  isGraphableObservationType,
  OBSERVATION_GRAPH_CONFIG,
  type GraphableObservationType,
} from '../components/observations/observation-graph.config';
import dayjs from '../utils/dayjs';
import {
  formatMeasurement,
  getObservationLabel,
  OBSERVATION_OPTIONS,
  observationColumns,
  type ObservationRow,
  type ObservationViewType,
} from '../utils/observations';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';

// interface for below hook
interface UseObservationsReturn {
  selectedObservation: ObservationViewType;
  startDate: string;
  endDate: string;
  showEntries: boolean;
  newMeasurement: string;
  isAddEntryModalOpen: boolean;
  filteredObservations: Observation_idstring[];
  observationLabels: string[];
  selectedObservationLabel: string;
  isGraphable: boolean;
  isRunningNotes: boolean;
  displayedObservationColumns: typeof observationColumns;
  observationRows: ObservationRow[];

  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
  setShowEntries: Dispatch<SetStateAction<boolean>>;
  setNewMeasurement: Dispatch<SetStateAction<string>>;
  setIsAddEntryModalOpen: Dispatch<SetStateAction<boolean>>;

  isValidMeasurementInput: () => boolean;
  handleAddGraphableEntry: (observationType: GraphableObservationType) => void;
  handleAddNonGraphableEntry: () => void;
  onAddNonGraphableEntry: (entry: {
    measurementValue?: number;
    notes: string;
  }) => void;
  handleObservationChange: (selectedLabels: string[]) => void;
}

// React hook for managing state and logic related to patient observations
export function useObservations(): UseObservationsReturn {
  // selected observation type, defaulting to the first option in OBSERVATION_OPTIONS
  const [selectedObservation, setSelectedObservation] =
    useState<ObservationViewType>('RUNNING_NOTES');

  // selected date range for filtering observations, defaulting to today's date
  const today = dayjs().tz().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  // controls whether observation entries table or graph view is shown for graphable observation types
  const [showEntries, setShowEntries] = useState(false);

  // state for the new measurement input field, used for adding new numeric observations (graphable types only)
  const [newMeasurement, setNewMeasurement] = useState('');

  // state for controlling the visibility of the modal for adding new non-graph observation entries (bowel/urine output)
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);

  // TODO: backend modify this and replace with the patient's observations for the selected observation type and date
  const [observations, setObservations] =
    useState<Observation_idstring[]>(DEMO_OBSERVATIONS);

  // TODO: backend replace this local observations filtering with backend filtering
  const filteredObservations = useMemo(() => {
    return observations.filter((observation) => {
      if (observation.type !== selectedObservation) {
        return false;
      }

      const observationDate = dayjs(observation.dateTime)
        .tz()
        .format('YYYY-MM-DD');

      return observationDate >= startDate && observationDate <= endDate;
    });
  }, [observations, selectedObservation, startDate, endDate]);

  // unique labels from the backend observation enum/data
  const observationLabels = OBSERVATION_OPTIONS.map((type) => {
    return getObservationLabel(type);
  });

  // map each observation label back to its observation type
  const observationTypeByLabel: Record<string, ObservationViewType> =
    Object.fromEntries(
      OBSERVATION_OPTIONS.map((type) => [getObservationLabel(type), type]),
    );

  // label for the currently selected observation type, used in dropdown and header
  const selectedObservationLabel = useMemo(() => {
    return getObservationLabel(selectedObservation);
  }, [selectedObservation]);

  // determine type of currently selected observation type
  const isGraphable =
    selectedObservation !== 'RUNNING_NOTES' &&
    isGraphableObservationType(selectedObservation);
  const isRunningNotes = selectedObservation === 'RUNNING_NOTES';
  const isBowelOutput = selectedObservation === 'BOWEL_OUTPUT';

  // filter the table columns to display based on the selected observation type
  const displayedObservationColumns = observationColumns.filter((column) => {
    if (isGraphable) {
      return column.rowKey !== 'notes';
    }

    if (isBowelOutput) {
      return column.rowKey !== 'measurement';
    }

    return true;
  });

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

  // function to validate the new measurement input
  function isValidMeasurementInput(): boolean {
    if (!isGraphable || newMeasurement.trim() === '') {
      return false;
    }

    // if the measurement is not a finite number, do not add
    const measurement = Number(newMeasurement);
    if (!Number.isFinite(measurement)) {
      return false;
    }

    // if the measurement is outside the min/max range for the selected observation type, do not add
    const { min, max } = OBSERVATION_GRAPH_CONFIG[selectedObservation];
    if (measurement < min || measurement > max) {
      return false;
    }

    return true;
  }

  // TODO: backend modify this to make a POST request to the backend to add a new observation for the patient
  // updates the local state with the new observation
  function handleAddGraphableEntry(
    observationType: GraphableObservationType,
  ): void {
    const measurement = Number(newMeasurement);
    // TODO: backend modify id creation (?) and replace with the backend-generated observation ID
    const newObservation: Observation_idstring = {
      patientId,
      _id: `OBS-ID-${dayjs().tz().format('DD/MM/YYYY')}-${patientId}`,
      type: observationType,
      dateTime: dayjs().toISOString(),
      measurementValue: measurement,
    };

    // local state update to include new observation
    setObservations((current) => [...current, newObservation]);
    setNewMeasurement('');
  }

  // open modal for adding a new non-numeric observation (bowel/urine)
  function handleAddNonGraphableEntry(): void {
    setIsAddEntryModalOpen(true);
  }

  // TODO: backend POST bowel/urine observation
  function onAddNonGraphableEntry(entry: {
    measurementValue?: number;
    notes: string;
  }): void {
    console.log(entry);
    setIsAddEntryModalOpen(false);
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

  // return all the state and handlers needed for the PatientObservations component
  return {
    selectedObservation,
    startDate,
    endDate,
    showEntries,
    newMeasurement,
    isAddEntryModalOpen,
    filteredObservations,
    observationLabels,
    selectedObservationLabel,
    isGraphable,
    isRunningNotes,
    displayedObservationColumns,
    observationRows,
    setStartDate,
    setEndDate,
    setShowEntries,
    setNewMeasurement,
    setIsAddEntryModalOpen,
    isValidMeasurementInput,
    handleAddGraphableEntry,
    handleAddNonGraphableEntry,
    onAddNonGraphableEntry,
    handleObservationChange,
  };
}
