import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import { templateStatusLabels, type TemplateStatus } from '@/app/utils/types';
import { useRouter } from 'next/navigation';
import { useState, type JSX, type ReactNode } from 'react';

// interface for a template
export interface Template {
  templateId: string; // unique identifier for the template
  name: string;
  type: MiniPresetLabel;
  status: TemplateStatus;
}

// interface for a template row in the table
interface TemplateRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    templateId: string;
    name: string;
    type: ReactNode;
    status: ReactNode;
    modifyTemplate: ReactNode;
  };
}

// general width for columns
const columnWidth = 200;

// column definition for the template table
export const templateColumns: TableColumn[] = [
  {
    rowKey: 'templateId',
    header: 'Template ID',
    width: 310,
    columnClassName: 'pl-15',
  },
  {
    rowKey: 'name',
    header: 'Template Name',
    width: columnWidth,
  },
  {
    rowKey: 'type',
    header: 'Type',
    width: columnWidth,
  },
  {
    rowKey: 'status',
    header: 'Status',
    width: columnWidth,
  },
  {
    rowKey: 'modifyTemplate',
    header: 'Modify Template',
    width: columnWidth,
    contentAlignment: 'center',
  },
];

// React icon component for routing to templates for modification
function TemplateViewButton({
  templateId,
}: Readonly<{ templateId: string }>): JSX.Element {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/templates/edit?id=${templateId}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <Icon name="pencil" width={30} className="text-rehua-navy" />
    </button>
  );
}

// options for the template status dropdown
const templateStatusOptions = Object.values(templateStatusLabels);

// convert a status label from the dropdown into its TemplateStatus value
function getTemplateStatusFromLabel(label: string): TemplateStatus | undefined {
  if (label === templateStatusLabels.active) {
    return 'active';
  }

  if (label === templateStatusLabels.archived) {
    return 'archived';
  }

  return undefined;
}

// React dropdown component for changing template status
function TemplateStatusDropdown({
  template,
}: Readonly<{ template: Template }>): JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState<TemplateStatus>(
    template.status,
  );

  function handleStatusChange(newValues: string[]): void {
    const newStatusLabel = newValues[0];

    if (newStatusLabel === undefined) {
      return;
    }

    const newStatus = getTemplateStatusFromLabel(newStatusLabel);

    if (newStatus === undefined) {
      return;
    }

    // TODO: backend send newStatus to the API for this template
    console.log(
      `Changing status for template ${template.templateId} to ${newStatus}`,
    );
    setSelectedStatus(newStatus);
  }

  return (
    <DropdownBar
      options={templateStatusOptions}
      selectedValues={[templateStatusLabels[selectedStatus]]}
      onChange={handleStatusChange}
      width={150}
    />
  );
}

// function to create a template row from a template object that will be rendered within the table
function createTemplateRow(template: Template, rowIndex: number): TemplateRow {
  return {
    id: rowIndex,
    content: {
      templateId: template.templateId,
      name: template.name,
      type: <MiniLabel name={template.type} />,
      status: <TemplateStatusDropdown template={template} />,
      modifyTemplate: <TemplateViewButton templateId={template.templateId} />,
    },
  };
}

// sample template data, what is expected from backend - TODO: backend replace this with actual data
export const templates: Template[] = [
  {
    templateId: '6a8fbd27f887e19388db5828',
    name: 'Infection Report',
    type: 'longTerm',
    status: 'active',
  },
  {
    templateId: '6a8fbd27f887e19388db5829',
    name: 'Pain Assessment',
    type: 'palliative',
    status: 'active',
  },
  {
    templateId: '6a8fbd27f887e19388db5830',
    name: 'Consent Form',
    type: 'shortTerm',
    status: 'active',
  },
];

// create template rows from the sample template data
export const templateRows: TemplateRow[] = templates.map((template, rowIndex) =>
  createTemplateRow(template, rowIndex),
);
