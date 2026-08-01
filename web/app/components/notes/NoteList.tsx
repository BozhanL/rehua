'use client';

import ContentButton from '../ContentButton';
import type { JSX } from 'react';

// interface representing a single note, including its metadata and content
interface Note {
  id: string;
  authorName: string;
  createdAt: string;
  plainText: string; // immutable, once note is created, the plain text cannot be changed
  html: string; // mutable, can be changed when formatting is edited
  lastFormattedBy?: string;
  lastFormattedAt?: string;
}

// interface for a list of notes, includes callback function for editing formatting of a note
interface NoteListProps {
  notes: Note[];
  onEditFormatting: (note: Note) => void;
}

// React component that renders a list of notes, each with its metadata, content, and an edit button
function NotesList({
  notes,
  onEditFormatting,
}: Readonly<NoteListProps>): JSX.Element {
  // sort notes such that most recent notes appear first, based on their creation date
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
            dangerouslySetInnerHTML={{ __html: note.html }}
          />

          {/* edit button */}
          <div className="flex justify-start">
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
