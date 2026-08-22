'use client';

import Icon, { type IconProps } from './Icon';
import Surface from './Surface';
import { useState, type JSX, type ReactNode } from 'react';

interface Tab {
  id: string; // unique identifier for tab, e.g. 'tab1', 'documents', 'test', etc
  label: string; // tab title
  iconProps?: IconProps; // optional icon for tab
  content: ReactNode; // tab content to be displayed when tab is active
  horizontalPadding?: string; // optional horizontal padding, fallback to '50px'
}

interface TabsProps {
  tabs: [Tab, Tab, ...Tab[]]; // at least 2 tabs are required
  textClassName?: string; // optional text class name for tab labels
}

// React component that renders a bar of tabs with respective content
function Tabs({ tabs, textClassName }: Readonly<TabsProps>): JSX.Element {
  // state to track currently active tab
  const [activeTab, setActiveTab] = useState(0);

  // validate that active tab index is within bounds of tabs array
  const validatedActiveTab = tabs[activeTab];
  if (!validatedActiveTab) {
    return <p>Unable to display selected tab.</p>;
  }

  // safety message if there are less than 2 tabs provided
  if (tabs.length < 2) {
    return <p>At least 2 tabs are required.</p>;
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* tabs bar, iterate through array and render each tab */}
      <div className="relative z-10 flex w-full shrink-0">
        {tabs.map((tab, index) => {
          // determine if tab is active, first, or last for styling purposes
          const isActive = index === activeTab;
          const isFirst = index === 0;
          const isLast = index === tabs.length - 1;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(index);
              }}
              className={`
                flex flex-none items-center justify-center gap-3 py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-rehua-navy text-rehua-white'
                    : 'bg-rehua-gray text-rehua-black'
                }
                ${isFirst ? 'rounded-tl-xl' : ''}
                ${isLast ? 'rounded-tr-xl' : ''}
              `}
              style={{
                paddingLeft: tab.horizontalPadding ?? '40px',
                paddingRight: tab.horizontalPadding ?? '40px',
              }}
            >
              {tab.iconProps && <Icon {...tab.iconProps} />}
              <span
                className={`
                  text-2xl font-bold
                  ${textClassName ?? ''}
                `}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* tab content */}
      <div className="min-h-0 flex-1">
        <Surface
          width={'100%'}
          height={'100%'}
          style={{ borderRadius: 0, boxShadow: '0 0 15px rgb(0 0 0 / 0.27)' }}
        >
          {validatedActiveTab.content}
        </Surface>
      </div>
    </div>
  );
}

export default Tabs;
export type { Tab };
