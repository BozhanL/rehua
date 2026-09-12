import type { HistoryEntry } from '../../demos/components/versionhistory/versionhistory.config';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import type { JSX } from 'react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onBack: () => void; // let the parent handle the back button
  historyEntries: HistoryEntry[]; // type of history
}

function VersionHistoryModal({
  isOpen,
  onBack,
  historyEntries,
}: Readonly<VersionHistoryModalProps>): JSX.Element {
  return (
    <Modal open={isOpen} surfaceProps={{ width: 1500, height: 750 }}>
      {/* content wrapper */}
      <div className="flex h-full flex-col gap-8 overflow-hidden p-10">
        {/* header row */}
        <div className="flex shrink-0 items-center gap-6">
          <button
            type="button"
            onClick={() => {
              onBack();
            }}
            className="shrink-0"
          >
            <Icon name="circle-arrow" className="text-rehua-navy" width={62} />
          </button>
          <Icon name="time" className="text-rehua-maroon" width={54} />
          <span className="text-4xl font-bold text-rehua-maroon">
            Version History
          </span>
        </div>

        {/* scrollable entry list */}
        <ol dir="rtl" className="min-h-0 flex-1 overflow-y-auto pl-6">
          {historyEntries.map((entry) => (
            <div
              key={entry.id}
              dir="ltr"
              className="
                ml-10 border-b border-gray-300 py-7
                last:border-b
              "
            >
              <span className="block text-2xl font-bold text-rehua-ruby">
                {entry.date.format('DD/MM/YYYY, h:mma')}
              </span>
              <span className="block text-2xl font-extrabold text-black">
                {entry.userName}
              </span>
              <div className="mt-3 flex flex-col gap-2 pl-8 text-xl">
                {entry.details.map((detail) => (
                  <ul
                    key={detail}
                    className="
                      mt-3 flex list-outside list-disc flex-col gap-2 pl-8
                      text-2xl
                      marker:text-black
                    "
                  >
                    {entry.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </ol>
      </div>
    </Modal>
  );
}

export default VersionHistoryModal;
