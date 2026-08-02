'use client';

import ContentButton from '../ContentButton';
import Icon from '../Icon';
import Modal from '../Modal';
import type { Note } from './NoteList';
import type { JSX } from 'react';

// interface for EditFormattingModal
interface EditFormattingModalProps {
  open: boolean; // modal visibility
  note: Note; // the note being edited
  currentUser: string; // currently logged in user, used to populate lastFormattedBy field in audit entry
  onClose: () => void; // callback function to close modal

  /**
   * callback function to save formatted changes to note
   *
   * TODO backend (remove this comment when backend is implemented):
   * - update note.html
   * - update lastFormattedBy and lastFormattedAt
   * - add an entry to auditHistory array (backend generate auditId)
   */
  onSave: (auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string; // html content of note before formatting changes were made
    afterHtml: string; // html content of note after formatting changes were made
  }) => void;
}

// React component that renders a modal for editing the formatting of a note
export default function EditFormattingModal({
  open,
  note,
  currentUser,
  onClose,
  onSave,
}: Readonly<EditFormattingModalProps>): JSX.Element {
  // saves the formatted changes to the note and closes the modal
  function handleSave(): void {
    onSave({
      noteId: note.noteId,
      formattedBy: currentUser,
      formattedAt: new Date().toISOString(),
      beforeHtml: note.html,
      afterHtml: note.html, // TODO: update this temporary placeholder: this would be the newly formatted HTML content
    });
    onClose();
  }

  return (
    <Modal open={open}>
      {/* overall modal layout */}
      <div className="flex h-full flex-col gap-5 p-6">
        {/* top row with back button, icon, and title */}
        <div className="flex items-center gap-6 p-3">
          <button onClick={onClose} style={{ cursor: 'pointer' }}>
            <Icon name="circle-arrow" width={65} className="text-rehua-navy" />
          </button>

          <Icon name="clipboard" width={45} className="text-rehua-maroon" />

          <div className="font-bold text-rehua-maroon" style={{ fontSize: 45 }}>
            Running Notes: Edit Entry
          </div>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-md border">
          {/* toolbar section for strikethrough button */}
          <div
            className="
              flex shrink-0 gap-2 border-b border-rehua-dark-gray
              bg-rehua-light-gray p-3
            "
          >
            <ContentButton
              text1="Strikethrough"
              iconProps={{ name: 'pencil-sign' }}
              height={45}
              verticalPadding={0.2}
              className="line-through"
              backgroundColor="bg-rehua-navy"
            />
          </div>

          {/* scrollable note content section */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3 text-2xl">
            {note.plainText}
          </div>
        </div>

        {/* submit audit button */}
        <div className="flex justify-end p-2">
          <ContentButton
            text1="Submit Audit"
            height={50}
            iconProps={{ name: 'pencil' }}
            backgroundColor="bg-rehua-orange"
            textIconGap={0.3}
            verticalPadding={0.2}
            onClick={handleSave}
          />
        </div>
      </div>
    </Modal>
  );
}
