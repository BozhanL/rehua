import {
  INITIAL_NOTES,
  patientId,
} from '../(pages)/patients/profile/tempobservationsdata';
import type {
  Note,
  NoteAuditEntry,
} from '../components/observations/notes/NoteList';
import dayjs from '../utils/dayjs';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';

// interface for below hook
interface UseRunningNotesReturn {
  notes: Note[];
  filteredNotes: Note[];
  editingNote: Note | null;
  isAddNoteOpen: boolean;

  setIsAddNoteOpen: Dispatch<SetStateAction<boolean>>;
  setEditingNoteId: Dispatch<SetStateAction<string | null>>;

  handleAddRunningNote: (noteInput: {
    plainText: string;
    html: string;
  }) => void;

  handleSaveFormatting: (auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string;
    afterHtml: string;
  }) => void;
}

// React hook for managing state and logic related to patient's running notes
export function useRunningNotes(
  startDate: string,
  endDate: string,
): UseRunningNotesReturn {
  // TODO: backend replace demo notes with patient's running notes for selected date
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  // running notes modal states
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // TODO: backend replace this local filtering with backend filtering
  const filteredNotes = useMemo(() => {
    // use if helpful
    // const startDateTime = dayjs.tz(startDate).startOf('day').toISOString();
    // const endDateTime = dayjs.tz(endDate).endOf('day').toISOString();
    return notes.filter((note) => {
      const noteDate = dayjs(note.createdAt).tz().format('YYYY-MM-DD');
      return noteDate >= startDate && noteDate <= endDate;
    });
  }, [notes, startDate, endDate]);

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

  return {
    notes,
    filteredNotes,
    editingNote,
    isAddNoteOpen,
    setIsAddNoteOpen,
    setEditingNoteId,
    handleAddRunningNote,
    handleSaveFormatting,
  };
}
