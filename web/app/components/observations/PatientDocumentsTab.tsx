'use client';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import {
  TableToolbar,
  type DocumentTag,
} from '@/app/components/dashboard/TableToolbar';
import AddDocumentModal from '@/app/components/modals/AddDocumentModal';
import useApiUrl from '@/app/hooks/useApiUrl';
import dayjs from '@/app/utils/dayjs';
import { isTesting } from '@/app/utils/env';
import { findByPatient } from '@rehua/sdk/functional/documents/patient';
import { updateTags as updateTagsSdk } from '@rehua/sdk/functional/documents/tag';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  useMemo,
  useState,
  type ChangeEvent,
  type JSX,
  type ReactNode,
} from 'react';

// TODO: backend to return all tags in the system
const allTags: DocumentTag[] = [
  { id: 'fall-risk', name: 'Fall Risk' },
  { id: 'mobility', name: 'Mobility' },
  { id: 'nutrition', name: 'Nutrition' },
  { id: 'wound-care', name: 'Wound Care' },
  { id: 'medication', name: 'Medication' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'hygiene', name: 'Hygiene' },
];

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

// table columns for the patient documents table
export const documentColumns: TableColumn[] = [
  {
    rowKey: 'checkbox',
    header: <Icon name="checked-box" width={30} />,
    width: 50,
    contentAlignment: 'center',
  },
  {
    rowKey: 'document',
    header: 'Document',
  },
  {
    rowKey: 'creationDate',
    header: 'Creation Date',
    width: 100,
  },
  {
    rowKey: 'state',
    header: 'State',
    width: 80,
  },
  {
    rowKey: 'documentType',
    header: 'Document Type',
  },
  {
    rowKey: 'tags',
    header: 'Tags',
    width: 235,
  },
  {
    rowKey: 'editDate',
    header: 'Edit Date',
  },
  {
    rowKey: 'open',
    header: 'Open',
    width: 65,
  },
];

// button to view a specific document for a patient
function DocumentViewButton({
  documentId,
  documentType,
}: Readonly<{
  documentId: string;
  documentType: findByPatient.Output[number]['documentType'];
}>): JSX.Element {
  const router = useRouter();
  const apiUrl = useApiUrl();

  return (
    <button
      type="button"
      onClick={() => {
        if (documentType === 'Upload') {
          router.push(`${apiUrl}/documents/file/${documentId}`);
        } else {
          router.push(`/document?id=${documentId}`);
        }
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useFindDocumentsByPatientOptions(patientId: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findByPatient.path(patientId), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      findByPatient(
        {
          host: host,
          simulate: isTesting,
          options: { signal, credentials: 'include' },
        },
        patientId,
      ),
  });
}

async function updateTags({
  host,
  id,
  tags: docData,
}: {
  host: string;
  id: string;
  tags: updateTagsSdk.Body;
}): Promise<void> {
  return updateTagsSdk(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    id,
    docData,
  );
}

const documentTypeLabels = {
  'Long Term': 'longTerm',
  'Short Term': 'shortTerm',
  Palliative: 'palliative',
  Daycare: 'daycare',
  Upload: 'upload',
} satisfies Record<
  findByPatient.Output[number]['documentType'],
  MiniPresetLabel
>;

interface PatientDocumentsProps {
  patientId: string;
}

// React component to display the whole documents tab for a patient
export function PatientDocuments({
  patientId,
}: Readonly<PatientDocumentsProps>): JSX.Element {
  const options = useFindDocumentsByPatientOptions(patientId);
  const docs = useQuery(options);
  const documents = docs.data;

  const host = useApiUrl();
  const queryClient = useQueryClient();
  const updateTagsMutation = useMutation({
    mutationFn: updateTags,
    onSuccess: async () => queryClient.invalidateQueries(options),
  });

  const [tags, setTags] = useState<DocumentTag[]>(allTags);

  // selected rows for exporting documents
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // selected tags for filtering documents
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);

  // input for creating a new tag
  const [newTagName, setNewTagName] = useState('');

  // open add document modal to create a new document from a template, or upload a pdf document
  const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);

  // function to update the tags associated with a document
  function updateDocumentTags(documentId: string, nextTagIds: string[]): void {
    updateTagsMutation.mutate({ host, id: documentId, tags: nextTagIds });
  }

  // function to toggle the selection of a document for exporting
  function toggleDocument(documentId: string): void {
    setSelectedDocumentIds((previous) =>
      previous.includes(documentId)
        ? previous.filter((id) => id !== documentId)
        : [...previous, documentId],
    );
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

    return documents?.filter((document) =>
      document.tags.some((tagId) => selectedFilterTags.includes(tagId)),
    );
  }, [documents, selectedFilterTags]);

  // construct table rows for the filtered documents
  const documentRows: DocumentRow[] | undefined = filteredDocuments?.map(
    (document, rowIndex) => ({
      id: rowIndex,
      content: {
        checkbox: (
          <input
            type="checkbox"
            checked={selectedDocumentIds.includes(document._id)}
            style={{
              width: 25,
              height: 25,
              margin: 0,
              transform: 'translateY(3px)',
            }}
            onChange={() => {
              toggleDocument(document._id);
            }}
          />
        ),
        document: document.fileName ?? document.templateId?.templateName ?? '',
        creationDate: dayjs(document.creationDate).tz().format('DD/MM/YYYY'),
        state: document.state,
        documentType: (
          <MiniLabel
            name={documentTypeLabels[document.documentType]}
            height={34}
          />
        ),
        tags: (
          <DropdownBar
            options={tags.map((tag) => tag.name)}
            selectedValues={document.tags.map(
              (tagId) => tags.find((tag) => tag.id === tagId)?.name ?? tagId,
            )}
            multiple={true}
            search={true}
            size={18}
            width={350}
            lengthOfDropdown={200}
            defaultText="Select tags . . ."
            onChange={(selectedNames) => {
              const selectedIds = tags
                .filter((tag) => selectedNames.includes(tag.name))
                .map((tag) => tag.id);
              updateDocumentTags(document._id, selectedIds);
            }}
          />
        ),
        editDate: document.editDate
          ? dayjs(document.editDate).tz().format('DD/MM/YYYY')
          : '-',
        open: (
          <DocumentViewButton
            documentId={document._id}
            documentType={document.documentType}
          />
        ),
      },
    }),
  );

  if (docs.isError) {
    throw docs.error;
  } else if (!docs.isSuccess || !documentRows) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <TableToolbar
        filterOptions={tags.map((tag) => tag.name)}
        selectedFilterValues={selectedFilterTags.map(
          (tagId) => tags.find((tag) => tag.id === tagId)?.name ?? tagId,
        )}
        onFilterChange={(selectedNames) => {
          const selectedIds = tags
            .filter((tag) => selectedNames.includes(tag.name))
            .map((tag) => tag.id);
          setSelectedFilterTags(selectedIds);
        }}
        inputValue={newTagName}
        onInputChange={(event: ChangeEvent<HTMLInputElement>) => {
          setNewTagName(event.currentTarget.value);
        }}
        onAddTag={addTag}
        onExport={() => {
          // TODO: backend export selected documents for patient
          console.log('Export documents', selectedDocumentIds);
        }}
        onAddDocument={() => {
          setOpenAddDocumentModal(true);
        }}
        documentColumns={documentColumns}
        documentRows={documentRows}
      />
      <AddDocumentModal
        isOpen={openAddDocumentModal}
        onBack={() => {
          setOpenAddDocumentModal(false);
        }}
        patientId={patientId}
      />
    </>
  );
}
