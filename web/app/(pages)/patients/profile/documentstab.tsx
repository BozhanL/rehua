'use client';
import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Table, {
  type TableColumn,
  type TableRow,
} from '@/app/components/common/Table';
import dayjs from '@/app/utils/dayjs';
import { useRouter } from 'next/navigation';
import {
  useMemo,
  useState,
  type ChangeEvent,
  type JSX,
  type ReactNode,
} from 'react';

// interface for document tags
export interface DocumentTag {
  id: string;
  name: string;
}

// interface for patient documents
export interface PatientDocument {
  id: string;
  name: string;
  creationDate: string; // ISO string
  state: 'Current' | 'Archive';
  documentType: MiniPresetLabel;
  tagIds: string[];
  editDate: string | null; // ISO string or null
}

// interface for table rows representing documents
interface DocumentRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    checkbox: ReactNode;
    document: string;
    creationDate: string;
    state: string;
    documentType: ReactNode;
    tags: ReactNode;
    editDate: string;
    open: ReactNode;
  };
}

// TODO: backend to return all tags in the system
const allTags: DocumentTag[] = [
  { id: 'fall-risk', name: 'Fall Risk' },
  { id: 'mobility', name: 'Mobility' },
  { id: 'nutrition', name: 'Nutrition' },
  { id: 'wound-care', name: 'Wound Care' },
];

// TODO: backend to return all documents for the current patient
const initialDocuments: PatientDocument[] = [
  {
    id: '1',
    name: 'Consent Form',
    creationDate: '2024-01-01T00:00:00.000Z',
    state: 'Current',
    documentType: 'daycare',
    tagIds: ['fall-risk', 'mobility'],
    editDate: '2024-12-31T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Mobility Assessment',
    creationDate: '2024-02-12T00:00:00.000Z',
    state: 'Current',
    documentType: 'longTerm',
    tagIds: ['mobility'],
    editDate: null,
  },
  {
    id: '3',
    name: 'Nutrition Plan',
    creationDate: '2024-03-08T00:00:00.000Z',
    state: 'Archive',
    documentType: 'upload',
    tagIds: ['nutrition'],
    editDate: '2025-03-08T00:00:00.000Z',
  },
];

// table columns for the patient documents table
export const documentColumns: TableColumn[] = [
  {
    rowKey: 'checkbox',
    header: <Icon name="checked-box" />,
  },
  {
    rowKey: 'document',
    header: 'Document',
  },
  {
    rowKey: 'creationDate',
    header: 'Creation Date',
  },
  {
    rowKey: 'state',
    header: 'State',
  },
  {
    rowKey: 'documentType',
    header: 'Document Type',
  },
  {
    rowKey: 'tags',
    header: 'Tags',
  },
  {
    rowKey: 'editDate',
    header: 'Edit Date',
  },
  {
    rowKey: 'open',
    header: 'Open',
  },
];

// button to view a specific document for a patient
function DocumentViewButton({
  patientId,
  documentId,
}: Readonly<{
  patientId: string;
  documentId: string;
}>): JSX.Element {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        // TODO: backend to provide patient id and documentId; adjust the route if needed
        router.push(
          `/patients/profile?id=${patientId}&documentId=${documentId}`,
        );
      }}
      style={{ cursor: 'pointer' }}
    >
      <Icon
        name="access"
        width={30}
        className="translate-y-1 text-rehua-navy"
      />
    </button>
  );
}

// React component to display the whole documents tab for a patient
export function PatientDocumentsList(): JSX.Element {
  // TODO: backend replace patientId with current patient's id
  const patientId = '123';

  // TODO: backend replace inital mock data with actual data from the backend
  // state for documents and tags
  const [documents, setDocuments] =
    useState<PatientDocument[]>(initialDocuments);
  const [tags, setTags] = useState<DocumentTag[]>(allTags);

  // selected rows for exporting documents
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // selected tags for filtering documents
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);

  // input for creating a new tag
  const [newTagName, setNewTagName] = useState('');

  // function to toggle the selection of a document for exporting
  function toggleDocument(documentId: string): void {
    setSelectedDocumentIds((previous) =>
      previous.includes(documentId)
        ? previous.filter((id) => id !== documentId)
        : [...previous, documentId],
    );
  }

  // function to update the tags associated with a document
  function updateDocumentTags(documentId: string, nextTagIds: string[]): void {
    // updates ui immediately
    setDocuments((previous) =>
      previous.map((document) =>
        document.id === documentId
          ? { ...document, tagIds: nextTagIds }
          : document,
      ),
    );

    // TODO: backend update tags for specific document
    console.log('"patch" tags', documentId, nextTagIds);
  }

  // function to add a new tag
  function addTag(): void {
    const trimmed = newTagName.trim();

    // if tag name is empty, do not add
    if (!trimmed) {
      return;
    }

    // TODO: backend - check if tag already exists, if so do not add
    const newTag: DocumentTag = {
      id: trimmed.toLowerCase().replaceAll(' ', '-'),
      name: trimmed,
    };

    setTags((previous) => [...previous, newTag]);

    // TODO: backend update (post) db with new tags

    setNewTagName('');
  }

  // filter documents based on selected tags
  const filteredDocuments = useMemo(() => {
    if (selectedFilterTags.length === 0) {
      return documents;
    }

    return documents.filter((document) =>
      document.tagIds.some((tagId) => selectedFilterTags.includes(tagId)),
    );
  }, [documents, selectedFilterTags]);

  // construct table rows for the filtered documents
  const documentRows: DocumentRow[] = filteredDocuments.map(
    (document, rowIndex) => ({
      id: rowIndex,
      content: {
        checkbox: (
          <input
            type="checkbox"
            checked={selectedDocumentIds.includes(document.id)}
            onChange={() => {
              toggleDocument(document.id);
            }}
          />
        ),
        document: document.name,
        creationDate: dayjs(document.creationDate).tz().format('DD/MM/YYYY'),
        state: document.state,
        documentType: <MiniLabel name={document.documentType} height={34} />,
        tags: (
          <DropdownBar
            options={tags.map((tag) => tag.name)}
            selectedValues={document.tagIds.map(
              (tagId) => tags.find((tag) => tag.id === tagId)?.name ?? tagId,
            )}
            multiple={true}
            defaultText="Select tags . . ."
            onChange={(selectedNames) => {
              const selectedIds = tags
                .filter((tag) => selectedNames.includes(tag.name))
                .map((tag) => tag.id);
              updateDocumentTags(document.id, selectedIds);
            }}
          />
        ),
        editDate: document.editDate
          ? dayjs(document.editDate).tz().format('DD/MM/YYYY')
          : '-',
        open: (
          <DocumentViewButton patientId={patientId} documentId={document.id} />
        ),
      },
    }),
  );

  return (
    <div className="flex flex-col gap-5">
      {/* documents tab toolbar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-65 flex-1">
          <DropdownBar
            options={tags.map((tag) => tag.name)}
            selectedValues={selectedFilterTags.map(
              (tagId) => tags.find((tag) => tag.id === tagId)?.name ?? tagId,
            )}
            multiple={true}
            defaultText="Filter by tags . . ."
            onChange={(selectedNames) => {
              const selectedIds = tags
                .filter((tag) => selectedNames.includes(tag.name))
                .map((tag) => tag.id);
              setSelectedFilterTags(selectedIds);
            }}
          />
        </div>

        <div className="flex min-w-70 flex-1 gap-3">
          <SingleLineInput
            type="text"
            value={newTagName}
            placeholder="Enter new tag label here . . ."
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewTagName(event.currentTarget.value);
            }}
          />

          <ContentButton
            text1="Add"
            text2="New Tag"
            textAlign="left"
            iconProps={{ name: 'pin' }}
            iconPosition="right"
            horizontalPadding={0.4}
            backgroundColor="bg-rehua-jordy"
            onClick={addTag}
          />
        </div>

        <div className="flex gap-3">
          <ContentButton
            text1="Export"
            text2="Selected"
            textAlign="left"
            iconProps={{ name: 'file' }}
            iconPosition="right"
            horizontalPadding={0.4}
            backgroundColor="bg-rehua-blue"
            onClick={() => {
              // TODO: backend export selected documents for patient
              console.log('Export documents', selectedDocumentIds);
            }}
          />

          <ContentButton
            text1="Add"
            text2="Document"
            textAlign="left"
            iconProps={{ name: 'plus' }}
            iconPosition="right"
            horizontalPadding={0.4}
            backgroundColor="bg-rehua-green"
            onClick={() => {
              // TODO: frontend - open modal
              console.log('Open add document modal');
            }}
          />
        </div>

        <Table columns={documentColumns} rows={documentRows} />
      </div>
    </div>
  );
}
