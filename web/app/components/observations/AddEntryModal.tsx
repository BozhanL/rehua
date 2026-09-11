import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import MultiLineInput from '../common/MultiLineInput';
import SingleLineInput from '../common/SingleLineInput';
import { useState, type ChangeEvent, type JSX } from 'react';

interface AddEntryModalProps {
  open: boolean;
  observationType: 'BOWEL_OUTPUT' | 'URINE_OUTPUT';
  onClose: () => void;
  onAdd: (entry: { measurementValue?: number; notes: string }) => void;
}

// React component that renders a modal for adding a new observation entry, either for urine output or bowel output
function AddEntryModal({
  open,
  observationType,
  onClose,
  onAdd,
}: Readonly<AddEntryModalProps>): JSX.Element {
  // state variables to hold the measurement value and notes input from user
  const [measurement, setMeasurement] = useState('');
  const [notes, setNotes] = useState('');

  // determine if the observation type is urine output, which requires a measurement value
  const isUrine = observationType === 'URINE_OUTPUT';

  // function to handle adding a new entry, validating input and calling the onAdd callback with the appropriate data
  function handleAdd(): void {
    const trimmedNotes = notes.trim();

    if (isUrine) {
      const value = Number(measurement);

      // validate that the measurement is a finite number and notes are not empty before proceeding
      if (!measurement.trim() || !Number.isFinite(value) || !trimmedNotes) {
        return;
      }

      onAdd({
        measurementValue: value,
        notes: trimmedNotes,
      });
    } else {
      // for bowel output, only notes are required, so validate that notes are not empty
      if (!trimmedNotes) {
        return;
      }

      onAdd({
        notes: trimmedNotes,
      });
    }

    setMeasurement('');
    setNotes('');
    onClose();
  }

  return (
    <Modal open={open}>
      <div className="flex h-full flex-col gap-7 p-8">
        {/* modal top row content */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              setMeasurement('');
              setNotes('');
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="circle-arrow" width={65} className="text-rehua-navy" />
          </button>

          <Icon name="clipboard" width={45} className="text-rehua-maroon" />

          <div className="font-bold text-rehua-maroon" style={{ fontSize: 45 }}>
            {isUrine ? 'Urine Output' : 'Bowel Output'}: Add New Entry
          </div>
        </div>

        {/* urine measurement */}
        {isUrine && (
          <SingleLineInput
            type="number"
            value={measurement}
            placeholder="Enter measurement . . ."
            style={{ height: 50, fontSize: 25 }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setMeasurement(event.target.value);
            }}
          />
        )}

        {/* notes and description */}
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-2xl font-bold">Notes & Description:</span>

          <div className="flex-1">
            <MultiLineInput
              value={notes}
              placeholder="Enter notes and description here . . ."
              style={{ height: '100%', fontSize: 25 }}
              onChange={(event) => {
                setNotes(event.target.value);
              }}
            />
          </div>
        </div>

        {/* add entry button */}
        <div className="flex justify-end">
          <ContentButton
            text1="Add Entry"
            height={50}
            iconProps={{ name: 'plus' }}
            backgroundColor="bg-rehua-green"
            verticalPadding={0.2}
            onClick={handleAdd}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddEntryModal;
