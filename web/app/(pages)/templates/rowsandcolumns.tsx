import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { templateStatusLabels, type TemplateStatus } from '@/app/utils/types';
import { update } from '@rehua/sdk/functional/templates';
import { useRouter } from 'next/navigation';
import { useState, type JSX, type ReactNode } from 'react';

async function updateTemplateStatus({
  host,
  templateId,
  status,
}: {
  host: string;
  templateId: string;
  status: 'active' | 'archived';
}): Promise<update.Output> {
  return update(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    templateId,
    { status },
  );
}

// interface for a template
export interface Template {
  _id: string; // unique identifier for the template
  templateName: string;
  version: number;
  templateType: string[];
  status: TemplateStatus;
}

// interface for a template row in the table
export interface TemplateRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    templateId: string;
    name: string;
    version: number;
    type: string;
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
    rowKey: 'version',
    header: 'Version',
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
  const host = useApiUrl();
  function handleStatusChange(newValues: string[]): void {
    const newStatusLabel = newValues[0];

    if (newStatusLabel === undefined) {
      return;
    }

    const newStatus = getTemplateStatusFromLabel(newStatusLabel);

    if (newStatus === undefined) {
      return;
    }

    console.log(`Changing status for template ${template._id} to ${newStatus}`);
    void updateTemplateStatus({
      host,
      templateId: template._id,
      status: newStatus,
    });
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

function formatStringArray(items: string[]): string {
  return items.join(', ');
}

// function to create a template row from a template object that will be rendered within the table
export function createTemplateRow(
  template: Template,
  rowIndex: number,
): TemplateRow {
  return {
    id: rowIndex,
    content: {
      templateId: template._id,
      name: template.templateName,
      version: template.version,
      type: formatStringArray(template.templateType),
      status: <TemplateStatusDropdown template={template} />,
      modifyTemplate: <TemplateViewButton templateId={template._id} />,
    },
  };
}
