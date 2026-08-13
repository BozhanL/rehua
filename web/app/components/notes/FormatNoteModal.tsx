'use client';

import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import type { Note } from './NoteList';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  LexicalComposer,
  type InitialConfigType,
} from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, FORMAT_TEXT_COMMAND } from 'lexical';
import { type JSX, type ReactNode, useMemo, useState } from 'react';

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
   * - validate if plaintext and html are the same in backend for extra validation
   *   -- note text should not be changed in formatting modal, only html formatting should be changed
   */
  onSave: (auditUpdate: {
    noteId: string;
    formattedBy: string;
    formattedAt: string;
    beforeHtml: string; // html content of note before formatting changes were made
    afterHtml: string; // html content of note after formatting changes were made
  }) => void;
}

// error boundary for RichTextPlugin, required by Lexical
function RichTextErrorBoundary({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return <>{children}</>;
}

// React component that renders a toolbar with buttons for text formatting
function Toolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <>
      <ContentButton
        text1="Strikethrough"
        iconProps={{ name: 'pencil-sign' }}
        height={45}
        verticalPadding={0.2}
        className="line-through"
        backgroundColor="bg-rehua-jordy"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
      />
      <ContentButton
        text1="Bold"
        iconProps={{ name: 'pencil-sign' }}
        height={45}
        verticalPadding={0.2}
        className="font-bold"
        backgroundColor="bg-rehua-jordy"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      />
      <ContentButton
        text1="Italic"
        iconProps={{ name: 'pencil-sign' }}
        height={45}
        verticalPadding={0.2}
        className="italic"
        backgroundColor="bg-rehua-jordy"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      />
      <ContentButton
        text1="Underline"
        iconProps={{ name: 'pencil-sign' }}
        height={45}
        verticalPadding={0.2}
        className="underline"
        backgroundColor="bg-rehua-jordy"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      />
    </>
  );
}

// normalise Lexical html for comparison with original note html
function normaliseHtml(html: string): string {
  return html
    .replace(/<span[^>]*>/g, '')
    .replaceAll('</span>', '')
    .replace(/\s+/g, ' ')
    .trim();
}

// React component that renders a modal for editing the formatting of a note
export default function EditFormattingModal({
  open,
  note,
  currentUser,
  onClose,
  onSave,
}: Readonly<EditFormattingModalProps>): JSX.Element {
  // current formatted html that will be saved
  const [html, setHtml] = useState(note.html);
  // check if there are any changes to the note's html formatting
  const hasChanges = normaliseHtml(html) !== normaliseHtml(note.html);

  // Lexical editor configuration, setup runs only once on initial render
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: 'NotesFormatting',
      editable: false,
      theme: {
        text: {
          strikethrough: 'line-through',
          underline: 'underline',
          bold: 'font-bold',
          italic: 'italic',
        },
      },
      editorState: (editor): void => {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(note.html, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        });
      },
      onError: (error: Error): void => {
        console.error(error);
      },
    }),
    [note.html],
  );

  // saves formatted changes to note and closes modal
  function handleSave(): void {
    // if there are no changes, do not call onSave (TODO: pop up should be displayed to inform user that there are no changes to save)
    if (!hasChanges) {
      return;
    }

    onSave({
      noteId: note.noteId,
      formattedBy: currentUser,
      formattedAt: new Date().toISOString(),
      beforeHtml: note.html,
      afterHtml: html,
    });
    onClose();
  }

  return (
    <Modal open={open}>
      {/* overall modal layout */}
      <div className="flex h-full flex-col gap-5 p-6">
        {/* top row with back button, icon, and title */}
        <div className="flex items-center gap-6">
          <button type="button" onClick={onClose} style={{ cursor: 'pointer' }}>
            <Icon name="circle-arrow" width={65} className="text-rehua-navy" />
          </button>

          <Icon name="clipboard" width={45} className="text-rehua-maroon" />

          <div className="font-bold text-rehua-maroon" style={{ fontSize: 45 }}>
            Running Notes: Edit Entry
          </div>
        </div>

        {/* Lexical editor */}
        <LexicalComposer key={note.noteId} initialConfig={initialConfig}>
          <div
            className="flex h-full flex-col overflow-hidden rounded-md border"
            style={{ boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.3)' }}
          >
            {/* toolbar section for formatter buttons */}
            <div
              className="
                flex shrink-0 gap-2 border-b border-rehua-mini-opaque-upload
                bg-rehua-mini-translucent-upload p-3
              "
            >
              <Toolbar />
            </div>

            {/* scrollable note content section */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 text-2xl">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="min-h-0 w-full outline-none" />
                }
                placeholder={null}
                ErrorBoundary={RichTextErrorBoundary}
              />

              {/* update html state when editor content changes */}
              <OnChangePlugin
                onChange={(editorState, editor) => {
                  editorState.read(() => {
                    setHtml($generateHtmlFromNodes(editor, null));
                  });
                }}
              />
            </div>
          </div>
        </LexicalComposer>

        {/* submit audit button */}
        <div className="flex justify-end">
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
