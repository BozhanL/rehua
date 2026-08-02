'use client';

import ContentButton from '../ContentButton';
import type { JSX } from 'react';

// interface representing data for audit of a note (version history)
interface NoteAuditEntry {
  id: string;
  auditorName: string;
  formattedAt: string;
  beforeHtml: string; // html content of note before formatting changes were made
  afterHtml: string; // html content of note after formatting changes were made
}

// interface representing a single note, including its metadata and content
interface Note {
  id: string;
  authorName: string;
  createdAt: string;
  plainText: string; // immutable, once note is created, the plain text cannot be changed
  html: string; // mutable, can be changed when formatting is edited
  lastFormattedBy?: string;
  lastFormattedAt?: string;
  auditHistory?: NoteAuditEntry[]; // version history of note, may not be present if no formatting edits have been made
}

// interface for a list of notes, includes callback function for editing formatting of a note and viewing audits
interface NoteListProps {
  notes: Note[];
  onEditFormatting: (note: Note) => void;
  onViewAuditHistory: (note: Note) => void;
}

// React component that renders a list of notes, each with its metadata, content, and an edit button
function NotesList({
  notes,
  onEditFormatting,
  onViewAuditHistory,
}: Readonly<NoteListProps>): JSX.Element {
  // sort notes such that most recent notes appear first, based on their creation date (ISO format)
  const sortedNotes = [...notes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="flex flex-col gap-4">
      {/* iterate through sorted notes */}
      {sortedNotes.map((note) => (
        <div key={note.id} className="flex flex-col gap-3 p-4">
          {/* display note author and creation date */}
          <div className="flex items-start justify-between">
            <div className="text-xl font-semibold">
              {note.authorName}
              <br />
              {note.createdAt}
            </div>
          </div>

          {/* note content, in formatted HTML, height depends on number of lines */}
          <div
            className="rounded-md border p-3 text-xl"
            style={{
              minHeight: 'auto',
              boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.3)',
            }}
            dangerouslySetInnerHTML={{ __html: note.html }} // render html content to see formatting changes
          />

          {/* edit button & version history button */}
          <div className="flex justify-start gap-3">
            <ContentButton
              text1="Edit Note"
              iconProps={{ name: 'pencil' }}
              backgroundColor="bg-rehua-orange"
              textIconGap={0.3}
              verticalPadding={0.2}
              onClick={() => {
                onEditFormatting(note);
              }}
            />
            <ContentButton
              text1="Previous Audits"
              iconProps={{ name: 'version-history' }}
              backgroundColor="bg-rehua-red"
              textIconGap={0.3}
              verticalPadding={0.2}
              onClick={() => {
                onViewAuditHistory(note);
              }}
            />
          </div>

          {/* footer of each note */}
          {note.lastFormattedAt && (
            <div className="border-b text-base font-semibold text-rehua-maroon">
              Last updated by {note.lastFormattedBy} on {note.lastFormattedAt}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
export type { Note };
