'use client';
import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import SingleLineInput from '../common/SingleLineInput';
import { UploadDocumentButton } from './UploadDocumentButton';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { TemplateDocumentType } from '@/app/utils/types';
import type { createFile } from '@rehua/sdk/functional/documents/file';
import { createForm as createFormSdk } from '@rehua/sdk/functional/documents/form';
import { findTemplatesWithType } from '@rehua/sdk/functional/templates/type';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useGetTemplateOptions(type: TemplateDocumentType | null) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findTemplatesWithType.path(type ?? 'Short Term'), host],
    enabled: type !== null,
    queryFn: async () => {
      if (type === null) {
        throw new Error('Unreachable: query is disabled');
      }

      return findTemplatesWithType(
        {
          host: host,
          simulate: isTesting,
          options: { credentials: 'include' },
        },
        type,
      );
    },
  });
}

async function createForm({
  host,
  docData,
}: {
  host: string;
  docData: createFormSdk.Body;
}): Promise<createFormSdk.Output> {
  return createFormSdk({ host, simulate: isTesting }, docData);
}

interface AddDocumentModalProps {
  isOpen: boolean;
  onBack: () => void; // let the parent handle the back button, matches AddMFAModal
  patientId: createFile.Body['patientId'];
}

function AddDocumentModal({
  isOpen,
  onBack,
  patientId,
}: Readonly<AddDocumentModalProps>): JSX.Element {
  const [category, setCategory] = useState<TemplateDocumentType | null>(null);
  const [label, setLabel] = useState<string | null>(
    'Add a New Patient Document',
  );
  // filter templates
  const [query, setQuery] = useState<string | null>(null);
  const [appliedQuery, setAppliedQuery] = useState<string | null>(null);

  const router = useRouter();

  function handleSwitch(category: TemplateDocumentType | null): void {
    const label = category ? 'Pick a Template' : 'Add a New Patient Document';
    setCategory(category);
    setLabel(label);
    setAppliedQuery(null);
  }

  const templateQuery = useGetTemplateOptions(category);
  const { data: templates = [] } = useQuery(templateQuery);

  const host = useApiUrl();
  const createFormMutation = useMutation({
    mutationFn: createForm,
  });

  const filteredTemplates = appliedQuery
    ? templates.filter((template) =>
        template.templateName
          .toLowerCase()
          .includes(appliedQuery.toLowerCase()),
      )
    : templates;

  const categoryColours = {
    'Long Term': { background: 'bg-rehua-green', icon: '#399740' },
    'Short Term': { background: 'bg-rehua-blue', icon: '#2a93bd' },
    Palliative: { background: 'bg-rehua-pastel-pink', icon: '#c2515c' },
    Daycare: { background: 'bg-rehua-orange', icon: '#c25a37' },
  } as const;

  const colours = categoryColours[category ?? 'Short Term'];

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
                backgroundColor={categoryColours['Long Term'].background}
                onClick={() => {
                  handleSwitch(TemplateDocumentType.LongTerm);
                }}
              />
              <ContentButton
                text1="Palliative"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                textIconGap={0.3}
                height={80}
                backgroundColor={categoryColours.Palliative.background}
                onClick={() => {
                  handleSwitch(TemplateDocumentType.Palliative);
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
                backgroundColor={categoryColours['Short Term'].background}
                onClick={() => {
                  handleSwitch(TemplateDocumentType.ShortTerm);
                }}
              />
              <ContentButton
                text1="Daycare"
                iconProps={{ name: 'plus', width: 0.5 }}
                iconPosition="right"
                textIconGap={0.5}
                height={80}
                backgroundColor={categoryColours.Daycare.background}
                onClick={() => {
                  handleSwitch(TemplateDocumentType.Daycare);
                }}
              />
              {/* file upload  */}
              <div className="col-span-2 flex justify-center">
                <UploadDocumentButton patientId={patientId} />
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
              {/* List of template options */}
              <div
                dir="rtl"
                className="
                  mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pl-10
                "
              >
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template._id}
                      dir="ltr"
                      className="flex shrink-0 items-center gap-4 py-1"
                    >
                      <Icon
                        name="folder-plus"
                        color={colours.icon}
                        width={45}
                      />
                      <ContentButton
                        text1={template.templateName}
                        backgroundColor={colours.background}
                        onClick={() => {
                          createFormMutation.mutate(
                            {
                              host,
                              docData: {
                                templateId: template._id,
                                patientId,
                                tags: [],
                                data: {},
                              },
                            },
                            {
                              onSuccess: (data) => {
                                router.push(`/document/?id=${data._id}`);
                              },
                            },
                          );
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
