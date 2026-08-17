'use client';

import Icon, { type IconProps } from './Icon';
import Surface from './Surface';
import { useState, type JSX, type ReactNode } from 'react';

interface Tab {
  label: string; // tab title
  iconProps?: IconProps; // optional icon for tab
  content: ReactNode; // tab content to be displayed when tab is active
}

interface TabsProps {
  tabs: [Tab, Tab, ...Tab[]]; // at least 2 tabs are required
  textClassName?: string; // optional text class name for tab labels
}

function Tabs({ tabs, textClassName }: Readonly<TabsProps>): JSX.Element {
  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length < 2) {
    return <p>At least 2 tabs are required.</p>;
  }

  return (
    <div className="w-full">
      {/* tabs bar */}
      <div className="flex w-full">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;

          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                setActiveTab(index);
              }}
              className={`
                flex flex-1 items-center justify-center gap-2 px-4 py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-rehua-navy text-rehua-white'
                    : 'bg-rehua-gray text-rehua-black'
                }
                ${isFirst ? 'rounded-tl-xl' : ''}
                ${isLast ? 'rounded-tr-xl' : ''}
              `}
            >
              {tab.iconProps && <Icon {...tab.iconProps} />}
              <span className={textClassName}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* tab content */}
      <Surface>{tabs[activeTab].content}</Surface>
    </div>
  );
}

export default Tabs;
