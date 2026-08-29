import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import Table from '@/app/components/common/Table';
import { useRouter } from 'next/navigation';
import { useState, type JSX, type ReactNode } from 'react';

// interface for a patient document
export interface PatientDocument {
  documentId: string;
  documentName: string;
  creationDate: string; // ISO string
  state: 'current' | 'archived';
  documentType: MiniPresetLabel;
  tagIds: string[];
  editDate: string; // ISO string
}

// interface for a document tag
export interface DocumentTag {
  tagId: string;
  name: string; // what the user actually typed
}

// TODO: backend - replace this with fetched data from the backend
export const documents: PatientDocument[] = [
  {
    documentId: '1',
    documentName: 'Consent Form',
    creationDate: '2024-01-01T00:00:00.000Z',
    state: 'current',
    documentType: 'daycare',
    tagIds: ['fall-risk', 'mobility'],
    editDate: '2024-12-31T00:00:00.000Z',
  },
];

// TODO: backend - replace this with fetched data from the backend
export const allTags: DocumentTag[] = [
  { tagId: 'fall-risk', name: 'Fall Risk' },
  { tagId: 'mobility', name: 'Mobility' },
  { tagId: 'nutrition', name: 'Nutrition' },
  { tagId: 'wound-care', name: 'Wound Care' },
];

// interface for a document row in the table
interface DocumentRow extends TableRow {
  id: number;
  content: {
    checkbox: ReactNode;
    document: string;
    creationDate: string;
    state: string;
    documentType: ReactNode;
    tags: ReactNode;
    endDate: string;
    open: ReactNode;
  };
}

// column definition for the document table
export const documentColumns: TableColumn[] = [
  {
    rowKey: 'checkedBox',
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
    rowKey: 'endDate',
    header: 'End Date',
  },
  {
    rowKey: 'open',
    header: 'Open',
  },
];

// TODO: backend - put in the correct documentId and include each button in their respective document row
function DocumentViewButton({
  documentId,
}: Readonly<{ documentId: string }>): JSX.Element {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push(
          `/patients/profile?id=insertPatientIdHere&documentId=${documentId}`,
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

// TODO: backend - replace this with fetched data from the backend
export const documentRows: DocumentRow[] = [
  {
    id: 1,
    content: {
      checkbox: <input type="checkbox" />,
      document: 'Consent form',
      creationDate: '01/01/2024',
      state: 'Current',
      documentType: <MiniLabel name="daycare" height={34} />,
      tags: (
        <DropdownBar
          options={['Tag 1', 'Tag 2', 'Tag 3']}
          selectedValues={['Tag 1', 'Tag 2']}
          multiple={true}
          defaultText="Select tags . . ."
          onChange={(selected) => {
            console.log('Selected tags:', selected);
          }}
        />
      ),
      endDate: '31/12/2024',
      open: <DocumentViewButton documentId="1" />,
    },
  },
];

// render the content of the patient documents tab
export function PatientDocumentsList(): JSX.Element {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');

  return <Table columns={documentColumns} rows={documentRows} />;
}
