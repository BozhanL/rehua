'use client';
import { INITIAL_NOTES, patientId } from './tempobservationsdata';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Table from '@/app/components/common/Table';
import AddEntryModal from '@/app/components/observations/AddEntryModal';
import Graph from '@/app/components/observations/Graph';
import AddNoteModal from '@/app/components/observations/notes/AddNoteModal';
import FormatNoteModal from '@/app/components/observations/notes/FormatNoteModal';
import type {
  Note,
  NoteAuditEntry,
} from '@/app/components/observations/notes/NoteList';
import NoteList from '@/app/components/observations/notes/NoteList';
import { useObservations } from '@/app/hooks/useObservations';
import dayjs from '@/app/utils/dayjs';
import { isGraphableType, isNonGraphableType } from '@/app/utils/observations';
import { useMemo, useState, type ChangeEvent, type JSX } from 'react';

// React component for displaying patient's observations
export function PatientObservations(): JSX.Element {
  const {
    selectedObservation,
    selectedDate,
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
    setSelectedDate,
    setShowEntries,
    setNewMeasurement,
    setIsAddEntryModalOpen,
    handleAddGraphableEntry,
    handleAddNonGraphableEntry,
    onAddNonGraphableEntry,
    handleObservationChange,
  } = useObservations();

  // TODO: backend replace demo notes with patient's running notes for selected date
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  // running notes modal states
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // today's running notes by default, or whichever date is selected
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        dayjs(note.createdAt).tz().format('YYYY-MM-DD') ===
        dayjs(selectedDate).tz().format('YYYY-MM-DD'),
    );
  }, [notes, selectedDate]);

  // currently selected note for formatting modal
  const editingNote = useMemo(
    () => notes.find((note) => note.noteId === editingNoteId) ?? null,
    [notes, editingNoteId],
  );

  // TODO: backend POST running note for patient
  function handleAddRunningNote(noteInput: {
    plainText: string;
    html: string;
  }): void {
    const newNote: Note = {
      noteId: `note-${dayjs().tz().toISOString()}-${patientId}`, // TODO: backend generate unique note ID (?)
      authorName: 'Jane Smith', // TODO: backend use authenticated user
      createdAt: dayjs().tz().toISOString(),
      plainText: noteInput.plainText,
      html: noteInput.html,
    };

    setNotes((current) => [newNote, ...current]);
  }

  // TODO: backend PATCH formatted running note + create audit entry
  function handleSaveFormatting(auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string;
    afterHtml: string;
  }): void {
    setNotes((current) =>
      current.map((note) => {
        if (note.noteId !== auditUpdate.noteId) {
          return note;
        }

        const auditEntry: NoteAuditEntry = {
          auditId: `audit-${dayjs().tz().toISOString()}-${patientId}`, // TODO: backend generate unique audit ID (?)
          formattedBy: auditUpdate.formattedBy,
          formattedAt: auditUpdate.formattedAt,
          beforeHtml: auditUpdate.beforeHtml,
          afterHtml: auditUpdate.afterHtml,
        };

        return {
          ...note,
          html: auditUpdate.afterHtml,
          lastFormattedBy: auditUpdate.formattedBy,
          lastFormattedAt: auditUpdate.formattedAt,
          auditHistory: [...(note.auditHistory ?? []), auditEntry],
        };
      }),
    );

    setEditingNoteId(null);
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

          {/* input for adding new entries + view entries/graph button */}
          <div className="ml-auto flex shrink-0 items-center gap-5">
            {isGraphable && !isRunningNotes && (
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
                if (isRunningNotes) {
                  setIsAddNoteOpen(true);
                } else if (isGraphable) {
                  handleAddGraphableEntry();
                } else {
                  handleAddNonGraphableEntry();
                }
              }}
            />

            {isGraphable && !isRunningNotes && (
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

      {/* main observation content; either graph, table or running notes */}
      <div className="overflow-x-auto">
        <div className="min-w-350 pb-10">
          {isRunningNotes ? (
            <div className="bg-rehua-white">
              <NoteList
                notes={filteredNotes}
                onEditFormatting={(note) => {
                  setEditingNoteId(note.noteId);
                }}
                onViewAuditHistory={(note) => {
                  // TODO: frontend open audit history modal
                  console.log(note.auditHistory);
                }}
              />
            </div>
          ) : (
            <>
              {isGraphableType(selectedObservation) && !showEntries ? (
                <div className="bg-rehua-white pl-10">
                  <Graph
                    type={selectedObservation}
                    data={filteredObservations}
                    width={1800}
                    height={550}
                  />
                </div>
              ) : (
                <Table
                  columns={displayedObservationColumns}
                  rows={observationRows}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* modals for adding and formatting running notes */}
      <AddNoteModal
        open={isAddNoteOpen}
        onClose={() => {
          setIsAddNoteOpen(false);
        }}
        onAdd={handleAddRunningNote}
      />

      {editingNote && (
        <FormatNoteModal
          open={true}
          note={editingNote}
          currentUser="Jane Smith" // TODO: backend use authenticated user
          onClose={() => {
            setEditingNoteId(null);
          }}
          onSave={handleSaveFormatting}
        />
      )}

      {/* modal for adding new non-graphable observation entries (bowel/urine output) */}
      {isNonGraphableType(selectedObservation) && (
        <AddEntryModal
          open={isAddEntryModalOpen}
          observationType={selectedObservation} // render slight changes depending on current observation type
          onClose={() => {
            setIsAddEntryModalOpen(false);
          }}
          onAdd={onAddNonGraphableEntry}
        />
      )}
    </>
  );
}
