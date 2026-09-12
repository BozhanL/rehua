'use client';

import ContentButton from '../../../components/common/ContentButton';
import VersionHistoryModal from '../../../components/modals/VersionHistoryModal';
import historyEntries from './versionhistory.config';
import { useState } from 'react';
import type { JSX } from 'react';

export default function VersionHistoryTestPage(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex p-5">
      <ContentButton
        text1="Version"
        text2="History"
        iconProps={{ name: 'time', width: 0.7 }}
        iconPosition="right"
        textAlign="left"
        height={56}
        lineHeight={1.1}
        foregroundColor="text-rehua-white"
        backgroundColor="bg-rehua-red"
        onClick={() => {
          setIsOpen(true);
        }}
      />

      <VersionHistoryModal
        isOpen={isOpen}
        onBack={() => {
          setIsOpen(false);
        }}
        historyEntries={historyEntries}
      />
    </div>
  );
}
