import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import MultiLineInput from '../common/MultiLineInput';
import PopUp from '../common/PopUp';
import SingleLineInput from '../common/SingleLineInput';
import dayjs from '@/app/utils/dayjs';
import { useState, type ChangeEvent, type JSX } from 'react';

interface AddEntryModalProps {
  open: boolean;
  observationType: 'BOWEL_OUTPUT' | 'URINE_OUTPUT';
  onAdd: (entry: { measurementValue?: number; notes: string }) => void;
  onClose: () => void;
  onInvalid: () => void;
}

// React component that renders a modal for adding a new observation entry, either for urine output or bowel output
function AddEntryModal({
  open,
  observationType,
  onClose,
  onAdd,
  onInvalid,
}: Readonly<AddEntryModalProps>): JSX.Element {
  // state variables to hold the measurement value and notes input from user
  const [measurement, setMeasurement] = useState('');
  const [notes, setNotes] = useState('');

  // state variable to control the visibility of the confirmation popup before adding a new graphable entry
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);

  // determine if the observation type is urine output, which requires a measurement value
  const isUrine = observationType === 'URINE_OUTPUT';

  // function to handle adding a new entry, validating input and calling the onAdd callback with the appropriate data
  function handleAdd(): void {
    const trimmedNotes = notes.trim();

    if (isUrine) {
      const value = Number(measurement);

      // validate that the measurement is a finite number and notes are not empty before proceeding
      if (!measurement.trim() || !Number.isFinite(value) || !trimmedNotes) {
        onInvalid();
        return;
      }
    } else {
      // for bowel output, only notes are required, so validate that notes are not empty
      if (!trimmedNotes) {
        onInvalid();
        return;
      }
    }

    // if the input is valid, ask for confirmation
    setIsConfirmPopupOpen(true);
  }

  return (
    <Modal open={open}>
      <div className="flex h-full flex-col gap-7 p-8">
        {/* confirmation popup */}
        <PopUp
          isAlertPopup={true}
          text1={`Are you sure you want to make a new entry for\n${isUrine ? 'Urine Output' : 'Bowel Output'}? The following measurement\nwill be recorded:`}
          text2={
            isUrine
              ? `${measurement} at ${dayjs().tz().format('HH:mm, DD MMMM YYYY')}`
              : `Bowel Output Entry at ${dayjs().tz().format('HH:mm, DD MMMM YYYY')}`
          }
          button1Props={{
            text1: 'CONFIRM',
            iconProps: { name: 'tick' },
            backgroundColor: 'bg-rehua-green',
            horizontalPadding: 0.5,
            onClick: () => {
              const trimmedNotes = notes.trim();

              if (isUrine) {
                onAdd({
                  measurementValue: Number(measurement),
                  notes: trimmedNotes,
                });
              } else {
                onAdd({
                  notes: trimmedNotes,
                });
              }

              // reset state and close modal after adding the entry
              setMeasurement('');
              setNotes('');
              setIsConfirmPopupOpen(false);
              onClose();
            },
          }}
          button2Props={{
            text1: 'DISCARD',
            iconProps: { name: 'trash' },
            backgroundColor: 'bg-rehua-red',
            verticalPadding: 0.2,
            horizontalPadding: 0.5,
            onClick: () => {
              setIsConfirmPopupOpen(false);
            },
          }}
          defaultButtonHeight={60}
          modalProps={{ open: isConfirmPopupOpen }}
        />

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
