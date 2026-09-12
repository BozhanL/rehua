import DropdownBar from '../common/DropdownBar';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import type { LogEntry } from './versionhistory.config';
import { useMemo, useState, type JSX } from 'react';

interface SystemLogModalProps {
  isOpen: boolean;
  onBack: () => void; // let the parent handle the back button
  logEntries: LogEntry[]; // list of logs, each with name,date,and description
}

const DATE_FORMAT = 'DD/MM/YYYY';
const HOUR_FORMAT = 'ha';

function SystemLogModal({
  isOpen,
  onBack,
  logEntries,
}: Readonly<SystemLogModalProps>): JSX.Element {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  // build the option lists from the entries, kept in chronological order
  const { userOptions, dateOptions, hourOptions } = useMemo(() => {
    const users = new Set<string>();
    const dates = new Map<string, number>(); // label -> timestamp, for sorting
    const hours = new Map<string, number>(); // label -> hour of day, for sorting

    for (const entry of logEntries) {
      users.add(entry.userName);
      dates.set(
        entry.date.format(DATE_FORMAT),
        entry.date.startOf('day').valueOf(),
      );
      hours.set(entry.date.format(HOUR_FORMAT), entry.date.hour());
    }
    function byValue(a: [string, number], b: [string, number]): number {
      return a[1] - b[1];
    }

    return {
      userOptions: [...users].sort((a, b) => a.localeCompare(b)),
      dateOptions: [...dates].sort(byValue).map(([label]) => label),
      hourOptions: [...hours].sort(byValue).map(([label]) => label),
    };
  }, [logEntries]);

  // filter the entries if any dropdown has a selection
  const visibleEntries = useMemo(
    () =>
      logEntries.filter(
        (entry) =>
          (selectedUsers.length === 0 ||
            selectedUsers.includes(entry.userName)) &&
          (selectedDates.length === 0 ||
            selectedDates.includes(entry.date.format(DATE_FORMAT))) &&
          (selectedHours.length === 0 ||
            selectedHours.includes(entry.date.format(HOUR_FORMAT))),
      ),
    [logEntries, selectedUsers, selectedDates, selectedHours],
  );

  return (
    <Modal open={isOpen} surfaceProps={{ width: '80dvw', height: '90dvh' }}>
      {/* content wrapper */}
      <div className="flex h-full flex-col gap-8 p-10">
        {/* header row */}
        <div
          className="
            flex shrink-0 items-center gap-6 overflow-x-auto overflow-y-hidden
          "
        >
          <button
            type="button"
            onClick={() => {
              onBack();
            }}
            className="shrink-0"
          >
            <Icon name="circle-arrow" className="text-rehua-navy" width={62} />
          </button>
          <Icon
            name="clipboard"
            className="shrink-0 text-rehua-maroon"
            width={50}
          />
          <span className="shrink-0 text-4xl font-bold text-rehua-maroon">
            System Logs
          </span>

          {/* filters, pushed to the right of the title */}
          <div className="ml-auto flex shrink-0 items-center gap-4">
            <DropdownBar
              options={userOptions}
              selectedValues={selectedUsers}
              onChange={setSelectedUsers}
              multiple
              search
              defaultText="User"
              labelMode="replace"
              width={240}
              size={26}
              lengthOfDropdown={320}
              zindex={55}
            />
            <DropdownBar
              options={dateOptions}
              selectedValues={selectedDates}
              onChange={setSelectedDates}
              multiple
              search
              defaultText="Date"
              labelMode="replace"
              width={240}
              size={26}
              lengthOfDropdown={320}
              zindex={55}
            />
            <DropdownBar
              options={hourOptions}
              selectedValues={selectedHours}
              onChange={setSelectedHours}
              multiple
              defaultText="Time"
              labelMode="replace"
              width={200}
              size={26}
              lengthOfDropdown={320}
              zindex={55}
            />
          </div>
        </div>

        {/* scrollable entry list */}
        <ol
          dir="rtl"
          className="relative z-0 min-h-0 flex-1 overflow-y-auto pl-6"
        >
          {visibleEntries.length === 0 ? (
            <li dir="ltr" className="ml-10 py-7 text-2xl text-rehua-dark-gray">
              No logs match the selected filters.
            </li>
          ) : (
            visibleEntries.map((entry) => (
              <div key={entry.id} dir="ltr">
                <li
                  key={entry.id}
                  dir="ltr"
                  className="
                    ml-10 border-b border-gray-300 py-7
                    first:pt-0
                    last:border-b
                  "
                >
                  <span className="block text-2xl font-bold text-rehua-ruby">
                    {entry.date.format('DD/MM/YYYY, h:mma')}
                  </span>
                  <span className="block text-2xl font-extrabold text-black">
                    {entry.userName}
                  </span>
                  <ul
                    className="
                      mt-3 flex list-outside list-disc flex-col gap-2 pl-10
                      text-2xl
                    "
                  >
                    {entry.details.map((detail) => (
                      <li className="first:pt-0" key={detail}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </li>
              </div>
            ))
          )}
        </ol>
      </div>
    </Modal>
  );
}

export default SystemLogModal;
