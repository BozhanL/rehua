import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import Table, {
  type TableColumn,
  type TableRow,
} from '@/app/components/common/Table';
import type { ChangeEvent, JSX } from 'react';

// interface for document tags
export interface DocumentTag {
  id: string;
  name: string;
}

interface TableToolbarProps {
  // tags filter dropdown
  filterOptions: string[];
  selectedFilterValues: string[];
  onFilterChange: (values: string[]) => void;

  // new tags input
  inputValue: string;
  onInputChange: (value: ChangeEvent<HTMLInputElement>) => void;

  // for button beside new tags input
  onAddTag: () => void;

  // export button callback
  onExport: () => void;

  // add document button callback
  onAddDocument: () => void;

  // table columns and rows
  documentColumns: TableColumn[];
  documentRows: TableRow[];
}

// React component for toolbar and documents table
export function TableToolbar({
  filterOptions,
  selectedFilterValues,
  onFilterChange,
  inputValue,
  onInputChange,
  onAddTag,
  onExport,
  onAddDocument,
  documentColumns,
  documentRows,
}: Readonly<TableToolbarProps>): JSX.Element {
  return (
    <>
      <div className="gap-3.5 overflow-x-auto">
        <div className="flex min-w-full items-center justify-between gap-4 p-5">
          {/* filter dropdown */}
          <DropdownBar
            options={filterOptions}
            selectedValues={selectedFilterValues}
            multiple={true}
            search={true}
            size={18}
            width={450}
            lengthOfDropdown={200}
            defaultText="Filter by tags . . ."
            onChange={onFilterChange}
          />

          {/* new tags input */}
          <div className="shrink-0">
            <SingleLineInput
              type="text"
              value={inputValue}
              placeholder={'Enter new tag label here . . .'}
              style={{ width: 450, height: 40, fontSize: 18 }}
              onChange={onInputChange}
            />
          </div>

          {/* button to add new tag */}
          <div className="shrink-0">
            <ContentButton
              text1="Add"
              text2="New Tag"
              textAlign="left"
              lineHeight={1.1}
              textIconGap={0.4}
              iconProps={{ name: 'pin', width: 0.9 }}
              iconPosition="right"
              horizontalPadding={0.4}
              verticalPadding={0.25}
              backgroundColor="bg-rehua-jordy"
              onClick={onAddTag}
            />
          </div>

          {/* righthand side buttons */}
          <div className="ml-auto flex shrink-0 gap-5">
            <ContentButton
              text1="Export"
              text2="Selected"
              textAlign="left"
              lineHeight={1.1}
              iconProps={{ name: 'file', width: 0.8 }}
              iconPosition="right"
              horizontalPadding={0.35}
              verticalPadding={0.25}
              textIconGap={0.4}
              backgroundColor="bg-rehua-blue"
              onClick={onExport}
            />

            <ContentButton
              text1="Add"
              text2="Document"
              textAlign="left"
              iconProps={{ name: 'plus', width: 0.9 }}
              iconPosition="right"
              lineHeight={1.1}
              horizontalPadding={0.35}
              verticalPadding={0.25}
              textIconGap={0.4}
              backgroundColor="bg-rehua-green"
              onClick={onAddDocument}
            />
          </div>
        </div>
      </div>

      {/* documents table */}
      <div className="overflow-x-auto">
        <div className="min-w-350">
          <Table columns={documentColumns} rows={documentRows} />
        </div>
      </div>
    </>
  );
}
