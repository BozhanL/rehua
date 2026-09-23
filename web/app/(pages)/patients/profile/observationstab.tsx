'use client';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Table from '@/app/components/common/Table';
import AddEntryModal from '@/app/components/observations/AddEntryModal';
import Graph from '@/app/components/observations/Graph';
import AddNoteModal from '@/app/components/observations/notes/AddNoteModal';
import FormatNoteModal from '@/app/components/observations/notes/FormatNoteModal';
import NoteList from '@/app/components/observations/notes/NoteList';
import { useObservations } from '@/app/hooks/useObservations';
import { useRunningNotes } from '@/app/hooks/useRunningNotes';
import dayjs from '@/app/utils/dayjs';
import { isGraphableType, isNonGraphableType } from '@/app/utils/observations';
import type { ChangeEvent, JSX } from 'react';

// React component for displaying patient's observations
export function PatientObservations(): JSX.Element {
  // custom hooks for managing observations and running notes
  const {
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
    handleAddGraphableEntry,
    handleAddNonGraphableEntry,
    onAddNonGraphableEntry,
    handleObservationChange,
  } = useObservations();

  const {
    filteredNotes,
    editingNote,
    isAddNoteOpen,
    setIsAddNoteOpen,
    setEditingNoteId,
    handleAddRunningNote,
    handleSaveFormatting,
  } = useRunningNotes(startDate, endDate);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-6 p-5">
          {/* observation title */}
          <span className="text-2xl font-bold text-rehua-navy">
            {selectedObservationLabel}
            {' for:'}
            <br />
            {dayjs(startDate).tz().format('DD/MM/YYYY')}
            {startDate !== endDate &&
              ` - ${dayjs(endDate).tz().format('DD/MM/YYYY')}`}
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

          {/* date filtering; single date for graphs, otherwise date range */}
          {!showEntries && !isRunningNotes ? (
            // single date input for graph view
            <div className="flex shrink-0 items-center gap-2">
              <label htmlFor="observation-date" style={{ fontSize: 18 }}>
                Filter by date:
              </label>

              <SingleLineInput
                id="observation-date"
                type="date"
                style={{ width: 300 }}
                value={startDate}
                onChange={(event) => {
                  // if the date input is cleared, reset to today's date
                  if (!event.target.value) {
                    setStartDate(dayjs().tz().format('YYYY-MM-DD'));
                    return;
                  }
                  // else, set the selected date to the chosen value (reset both start and end date for consistency)
                  setStartDate(event.target.value);
                  setEndDate(event.target.value);
                }}
              />
            </div>
          ) : (
            // date range input for entries view or running notes
            <div className="flex shrink-0 items-center gap-2">
              <label htmlFor="observation-start-date" style={{ fontSize: 18 }}>
                Filter by date range, from:
              </label>

              <SingleLineInput
                id="observation-start-date"
                type="date"
                style={{ width: 300 }}
                value={startDate}
                onChange={(event) => {
                  // if the date input is cleared, reset to today's date
                  if (!event.target.value) {
                    setStartDate(dayjs().tz().format('YYYY-MM-DD'));
                    return;
                  }
                  // else, set the selected date to the chosen value
                  setStartDate(event.target.value);
                }}
              />

              <span>to:</span>

              <SingleLineInput
                id="observation-end-date"
                type="date"
                style={{ width: 300 }}
                value={endDate}
                onChange={(event) => {
                  // if the date input is cleared, reset to today's date
                  if (!event.target.value) {
                    setEndDate(dayjs().tz().format('YYYY-MM-DD'));
                    return;
                  }
                  // else, set the selected date to the chosen value
                  setEndDate(event.target.value);
                }}
              />
            </div>
          )}

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
                  if (showEntries) {
                    // when switching from table view, set the end date to the start date to ensure graph view shows only one day
                    setEndDate(startDate);
                  }
                  // toggle between graph and table view
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
              {isGraphableType(selectedObservation) &&
              !showEntries &&
              startDate === endDate ? (
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
