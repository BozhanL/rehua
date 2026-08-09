'use client';

import ContentButton from '../ContentButton';
import Icon from '../Icon';
import Modal from '../Modal';
import MultiLineInput from '../MultiLineInput';
import { useState, type JSX } from 'react';

// interface for AddNoteModal, defines props for controlling modal visibility, closing modal, and adding a new note
// all props are managed by the parent component
interface AddNoteModalProps {
  open: boolean; // whether modal is open or closed
  onClose: () => void; // callback function to close modal

  /**
   * TODO backend (remove this comment when backend is implemented):
   * - create note object
   * - set the noteId, authorName, createdAt
   * - plaintext and html are given by frontend
   * - lastFormattedBy, lastFormattedAt and auditHistory = empty at first
   */
  onAdd: (noteInput: { plainText: string; html: string }) => void; // callback function to add a new note
}

// function to convert plain text to html by wrapping each line in <p> tags (inclusive of empty lines)
export function plainTextToHtml(plainText: string): string {
  return plainText
    .split(/\r?\n/)
    .map((line) =>
      line.trim().length === 0 ? '<p>&nbsp;</p>' : `<p>${escapeHtml(line)}</p>`,
    )
    .join('');
}

// record of characters to escape in html
const HTML_ESCAPE_CHARS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// function to escape html special characters in the plaintext, XSS attack prevention and proper rendering
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return HTML_ESCAPE_CHARS[char]!;
  });
}

// React component that renders a modal for adding a new note
function AddNoteModal({
  open,
  onClose,
  onAdd,
}: Readonly<AddNoteModalProps>): JSX.Element {
  // state to hold text input for new note
  const [text, setText] = useState('');

  // function to handle adding a new note; trims whitespace and checks for empty input before calling onAdd callback
  function handleAdd(): void {
    const plainText = text.trim();

    // if there are no changes, do not call onAdd (TODO: pop up should be displayed to inform user that note cannot be empty)
    if (!plainText) {
      return;
    }

    const html = plainTextToHtml(plainText);

    // call onAdd callback with trimmed text (plainText), reset input field, and close modal
    onAdd({ plainText, html });
    setText('');
    onClose();
  }

  return (
    <Modal open={open}>
      <div className="flex h-full flex-col gap-7 p-8">
        {/* modal top row content */}
        <div className="flex items-center gap-6">
          <button type="button" onClick={onClose} style={{ cursor: 'pointer' }}>
            <Icon name="circle-arrow" width={65} className="text-rehua-navy" />
          </button>
          <Icon name="clipboard" width={45} className="text-rehua-maroon" />
          <div className="font-bold text-rehua-maroon" style={{ fontSize: 45 }}>
            Running Notes: Add New Entry
          </div>
        </div>

        {/* multi-line input for new note text */}
        <div className="flex-1">
          <MultiLineInput
            value={text}
            placeholder="Enter new note here . . ."
            style={{ height: '100%', fontSize: 25 }}
            // update text state on input change
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>

        {/* add new note button */}
        <div className="flex justify-end gap-3">
          <ContentButton
            text1="Add New Note"
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

export default AddNoteModal;
