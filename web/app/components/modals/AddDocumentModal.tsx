'use client';
import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import SingleLineInput from '../common/SingleLineInput';
import { UploadDocumentButton } from './UploadDocumentButton';
import { useState, type ChangeEvent, type JSX } from 'react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onBack: () => void; // let the parent handle the back button, matches AddMFAModal
}

function AddDocumentModal({
  isOpen,
  onBack,
}: Readonly<AddDocumentModalProps>): JSX.Element {
  const [category, setCategory] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(
    'Add a New Patient Document',
  );
  // filter templates
  const [query, setQuery] = useState<string | null>(null);
  const [appliedQuery, setAppliedQuery] = useState<string | null>(null);

  function handleSwitch(category: string | null): void {
    const label = category ? 'Pick a Template' : 'Add a New Patient Document';
    setCategory(category);
    setLabel(label);
    setAppliedQuery(null);
    // TODO:
    // api call
  }

  //TODO:
  // Remove hardcoded templates when api call is implemented
  const templates = [
    'Client Satisfaction Questionnaire',
    'Admission Checklist Form',
    'Admission Notifcation Form',
    'Diabetes Test',
    'Client Satisfactoin Questionnaire',
    'Admission Checklist Test',
    'Admission Notifcation Test',
    'Diabetes Form',
  ];

  const filteredTemplates = appliedQuery
    ? templates.filter((template) =>
        template.toLowerCase().includes(appliedQuery.toLowerCase()),
      )
    : templates;

  const categoryColours = {
    longterm: { background: 'bg-rehua-green', icon: '#399740' },
    shortterm: { background: 'bg-rehua-blue', icon: '#2a93bd' },
    palliative: { background: 'bg-rehua-pastel-pink', icon: '#c2515c' },
    daycare: { background: 'bg-rehua-orange', icon: '#c25a37' },
  } as const;

  const colours = categoryColours[category as keyof typeof categoryColours];

  return (
    <Modal open={isOpen} surfaceProps={{ width: 650, height: 500 }}>
      {/* content wrapper */}
      <div className="flex h-full flex-col gap-6 overflow-hidden p-8">
        {/* header row */}
        <div className="flex shrink-0 items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (category === null) {
                onBack();
              } else {
                handleSwitch(null);
              }
            }}
            aria-label="Go back"
            className="shrink-0"
          >
            <Icon name="circle-arrow" className="text-rehua-navy" width={50} />
          </button>
          <Icon name="folder" className="text-rehua-maroon" width={43} />
          <span className="text-3xl font-bold text-rehua-maroon">{label}</span>
        </div>
        {/* category buttons */}

        <div className="flex min-h-0 flex-1">
          {category === null ? (
            <div
              className="
                grid w-full grid-cols-2 justify-items-center gap-10 pt-5
              "
            >
              <ContentButton
                text1="Long"
                text2="Term"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                height={80}
                textIconGap={0.5}
                style={{ width: 240 }}
                backgroundColor={categoryColours.longterm.background}
                onClick={() => {
                  handleSwitch('longterm');
                }}
              />
              <ContentButton
                text1="Palliative"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                textIconGap={0.3}
                height={80}
                backgroundColor={categoryColours.palliative.background}
                onClick={() => {
                  handleSwitch('palliative');
                }}
              />
              <ContentButton
                text1="Short"
                text2="Term"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                textIconGap={0.5}
                height={80}
                style={{ width: 240 }}
                backgroundColor={categoryColours.shortterm.background}
                onClick={() => {
                  handleSwitch('shortterm');
                }}
              />
              <ContentButton
                text1="Daycare"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                textIconGap={0.5}
                height={80}
                backgroundColor={categoryColours.daycare.background}
                onClick={() => {
                  handleSwitch('daycare');
                }}
              />
              {/* file upload  */}
              <div className="col-span-2 flex justify-center">
                <UploadDocumentButton />
              </div>
            </div>
          ) : (
            // search bar and button
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 gap-3 pl-10">
                <SingleLineInput
                  placeholder={'Enter Template Name Here'}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value);
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      setAppliedQuery(query);
                    }
                  }}
                  style={{ width: 400, fontSize: '18px' }}
                />
                <ContentButton
                  backgroundColor="bg-rehua-jordy"
                  iconProps={{ name: 'search' }}
                  text1="Search"
                  onClick={() => {
                    setAppliedQuery(query);
                  }}
                />
              </div>
              {/* TODO: api call based on category or something (need to research) */}
              {/* List of template options */}
              <div
                dir="rtl"
                className="
                  mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pl-10
                "
              >
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    // TODO: change key to template.id so its unique
                    <div
                      key={template}
                      dir="ltr"
                      className="flex shrink-0 items-center gap-4 py-1"
                    >
                      <Icon
                        name="folder-plus"
                        color={colours.icon}
                        width={45}
                      />
                      <ContentButton
                        text1={template}
                        backgroundColor={colours.background}
                        onClick={() => {
                          // handle template selection
                        }}
                        height={61}
                        style={{ width: 470 }}
                      />
                    </div>
                  ))
                ) : (
                  <span
                    dir="ltr"
                    className="px-4 py-3 text-lg text-rehua-navy/60"
                  >
                    No templates found.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AddDocumentModal;
