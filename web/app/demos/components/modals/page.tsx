'use client';

import ContentButton from '../../../components/common/ContentButton';
import SystemLogModal from '../../../components/modals/SystemLogsModal';
import VersionHistoryModal from '../../../components/modals/VersionHistoryModal';
import {
  historyEntries,
  logEntries,
} from '../../../components/modals/versionhistory.config';
import AddDocumentModal from '@/app/components/modals/AddDocumentModal';
import { useState } from 'react';
import type { JSX } from 'react';

export default function VersionHistoryTestPage(): JSX.Element {
  const [showAddModal, setShowAddModal] = useState(false);
  const [vhModalOpen, setVhModalOpen] = useState(false);
  const [sysLogModalOpen, setSysLogModalOpen] = useState(false);

  return (
    <div className="p-5">
      <h1>Modals test page</h1>
      <div className="flex flex-col">
        <div className="flex">
          <h2 className="pr-5">1)</h2>
          <ContentButton
            text1="Add"
            text2="Document"
            onClick={() => {
              setShowAddModal(true);
            }}
            backgroundColor="bg-rehua-green"
            verticalPadding={0.2}
            horizontalPadding={0.5}
            lineHeight={1.1}
            textIconGap={0.4}
            className="text-base"
            iconProps={{ name: 'plus' }}
            iconPosition="right"
          />
        </div>
        <div className="flex">
          <h2 className="pr-5">2)</h2>
          <ContentButton
            text1="Version"
            text2="History"
            backgroundColor="bg-rehua-ruby"
            verticalPadding={0.2}
            horizontalPadding={0.5}
            lineHeight={1.1}
            textIconGap={0.4}
            className="text-base"
            iconPosition="right"
            iconProps={{ name: 'time' }}
            onClick={() => {
              setVhModalOpen(true);
            }}
          />
        </div>
        <div className="flex">
          <h2 className="pr-5">3)</h2>
          <ContentButton
            text1="View"
            text2="Logs"
            iconProps={{ name: 'clipboard' }}
            backgroundColor="bg-rehua-navy"
            iconPosition="left"
            verticalPadding={0.2}
            horizontalPadding={0.5}
            lineHeight={1.1}
            textIconGap={0.4}
            className="text-base"
            onClick={() => {
              setSysLogModalOpen(true);
            }}
          />
        </div>
        <AddDocumentModal
          isOpen={showAddModal}
          onBack={() => {
            setShowAddModal(false);
          }}
        />
        <VersionHistoryModal
          isOpen={vhModalOpen}
          onBack={() => {
            setVhModalOpen(false);
          }}
          historyEntries={historyEntries}
        />
        <SystemLogModal
          isOpen={sysLogModalOpen}
          onBack={() => {
            setSysLogModalOpen(false);
          }}
          logEntries={logEntries}
        />
      </div>
    </div>
  );
}
