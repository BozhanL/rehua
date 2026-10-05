import type {
  Note,
  NoteAuditEntry,
} from '../components/observations/notes/NoteList';
import { APIUrlContext, queryClient } from '../providers';
import { sessionStorageGetUserInfo } from '../utils/auth';
import dayjs from '../utils/dayjs';
import { isTesting } from '../utils/env';
import { create } from '@rehua/sdk/functional/observations';
import { findObservationByDateRange } from '@rehua/sdk/functional/observations/type/startDate/endDate';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import {
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

// interface for below hook
interface UseRunningNotesReturn {
  notes: Note[];
  filteredNotes: Note[];
  editingNote: Note | null;
  isAddNoteOpen: boolean;
  submissionError: string | null;

  setIsAddNoteOpen: Dispatch<SetStateAction<boolean>>;
  setSubmissionError: Dispatch<SetStateAction<string | null>>;
  setEditingNoteId: Dispatch<SetStateAction<string | null>>;

  handleAddRunningNote: (noteInput: {
    plainText: string;
    html: string;
  }) => Promise<void>;

  handleSaveFormatting: (auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string;
    afterHtml: string;
  }) => Promise<void>;
}

// React hook for managing state and logic related to patient's running notes
export function useRunningNotes(
  patientId: string,
  startDate: string,
  endDate: string,
): UseRunningNotesReturn {
  const host = useContext(APIUrlContext);

  const [notes, setNotes] = useState<Note[]>([]);

  // running notes modal states
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function useFindObservationByDateRange(
    patientId: string,
    type: 'RUNNING_NOTES',
    startDate: string,
    endDate: string,
  ) {
    return queryOptions({
      queryKey: ['observations', host, patientId, type, startDate, endDate],
      queryFn: async ({ signal }: QueryFunctionContext) =>
        findObservationByDateRange(
          {
            host: host,
            simulate: isTesting,
            options: { signal, credentials: 'include' },
          },
          patientId,
          {
            type,
            startDate,
            endDate,
          },
        ),
    });
  }

  const runningNotesQuery = useFindObservationByDateRange(
    patientId,
    'RUNNING_NOTES',
    startDate,
    endDate,
  );

  const doc = useQuery(runningNotesQuery);

  const serverNotes = useMemo<Note[]>(
    () =>
      (doc.data ?? []).map((note) => ({
        noteId: note._id,
        authorName: note.authorName ?? '[Invalid Author Name]',
        authorUserName: note.authorUserName,
        createdAt: note.createdAt,
        plainText: note.plainText ?? '',
        html: note.html ?? '',
        lastFormattedBy: note.lastFormattedBy,
        lastFormattedAt: note.lastFormattedAt,
        auditHistory: note.auditHistory,
      })),
    [doc.data],
  );

  const displayedNotes = notes.length > 0 ? notes : serverNotes;

  const filteredNotes = useMemo(() => {
    return displayedNotes.filter((note) => {
      const noteDate = dayjs(note.createdAt).tz().format('YYYY-MM-DD');
      return noteDate >= startDate && noteDate <= endDate;
    });
  }, [displayedNotes, startDate, endDate]);

  // currently selected note for formatting modal
  const editingNote = useMemo(
    () => displayedNotes.find((note) => note.noteId === editingNoteId) ?? null,
    [displayedNotes, editingNoteId],
  );

  // add a new running note through the backend
  async function handleAddRunningNote(noteInput: {
    plainText: string;
    html: string;
  }): Promise<void> {
    try {
      setSubmissionError(null);
      await createRunningNote({
        patientId,
        type: 'RUNNING_NOTES',
        createdAt: dayjs().tz().toISOString(),
        authorName: `${sessionStorageGetUserInfo().firstName} ${sessionStorageGetUserInfo().lastName}`,
        authorUserName: sessionStorageGetUserInfo().userName,
        ...noteInput,
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Unable to add running note.',
      );
    }
  }

  // create a running note and refresh the cached notes for the patient
  async function createRunningNote(
    note: Parameters<typeof create>[1],
  ): Promise<void> {
    const createdNote = await create(
      {
        host,
        simulate: isTesting,
        options: { credentials: 'include' },
      },
      note,
    );
    queryClient.setQueriesData<Observation_idstring[]>(
      { queryKey: ['observations', host, patientId] },
      (current) => (current ? [createdNote, ...current] : current),
    );
    await queryClient.invalidateQueries({
      queryKey: ['observations', host, patientId, 'RUNNING_NOTES'],
    });
  }

  // persist formatting changes and append the note's audit history
  async function handleSaveFormatting(auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string;
    afterHtml: string;
  }): Promise<void> {
    try {
      setSubmissionError(null);
      const auditEntry: NoteAuditEntry = {
        auditId: `audit-${dayjs().tz().toISOString()}-${patientId}`,
        formattedBy: auditUpdate.formattedBy,
        formattedAt: auditUpdate.formattedAt,
        beforeHtml: auditUpdate.beforeHtml,
        afterHtml: auditUpdate.afterHtml,
      };

      const response = await fetch(
        `${host}/observations/${encodeURIComponent(auditUpdate.noteId)}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: auditUpdate.afterHtml,
            lastFormattedBy: auditUpdate.formattedBy,
            lastFormattedAt: auditUpdate.formattedAt,
            auditHistory: [
              ...(displayedNotes.find(
                (note) => note.noteId === auditUpdate.noteId,
              )?.auditHistory ?? []),
              auditEntry,
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Unable to save note formatting, please try again later.`,
        );
      }

      setNotes(
        displayedNotes.map((note) =>
          note.noteId === auditUpdate.noteId
            ? {
                ...note,
                html: auditUpdate.afterHtml,
                lastFormattedBy: auditUpdate.formattedBy,
                lastFormattedAt: auditUpdate.formattedAt,
                auditHistory: [...(note.auditHistory ?? []), auditEntry],
              }
            : note,
        ),
      );
      setEditingNoteId(null);
      await queryClient.invalidateQueries({
        queryKey: ['observations', host, patientId, 'RUNNING_NOTES'],
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : 'Unable to save note formatting.',
      );
    }
  }

  if (doc.isError) {
    throw doc.error;
  }

  return {
    notes,
    filteredNotes,
    editingNote,
    isAddNoteOpen,
    submissionError,
    setIsAddNoteOpen,
    setSubmissionError,
    setEditingNoteId,
    handleAddRunningNote,
    handleSaveFormatting,
  };
}
