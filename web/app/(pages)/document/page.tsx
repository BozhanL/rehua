'use client';

import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import PopUp from '@/app/components/common/PopUp';
import Surface from '@/app/components/common/Surface';
import FormTemplate from '@/app/components/form';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { findOne as getDocument } from '@rehua/sdk/functional/documents';
import { updateForm as updateFormSdk } from '@rehua/sdk/functional/documents/form';
import {
  queryOptions,
  useMutation,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useState, type JSX } from 'react';
import typia from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useGetDocumentOptions(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [getDocument.path(id), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      getDocument(
        {
          host: host,
          simulate: isTesting,
          options: { signal },
        },
        id,
      ),
  });
}

async function updateForm({
  host,
  id,
  docData,
}: {
  host: string;
  id: string;
  docData: updateFormSdk.Body;
}): Promise<updateFormSdk.Output> {
  return updateFormSdk({ host, simulate: isTesting }, id, docData);
}

export default function Home(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  typia.assertGuard<string>(id);

  const [savePopupOpen, setSavePopupOpen] = useState<boolean>(false);
  const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);
  const [saveEmptyFieldsPopupOpen, setSaveEmptyFieldsPopupOpen] =
    useState<boolean>(false);

  const [docData, setDocData] = useState<getDocument.Output>(null);

  const options = useGetDocumentOptions(id);
  const doc = useQuery(options);
  const data = doc.data;

  const host = useApiUrl();
  const updateFormMutation = useMutation({
    mutationFn: updateForm,
  });

  const router = useRouter();

  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!data?.template) {
    console.log(data);
    notFound();
  }

  const currentData = docData ?? data;

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        <div className="bg-rehua-white">
          {/* Save Document PopUp */}
          <PopUp
            isAlertPopup
            text1={`Are you sure you want to save\nthe this document?`}
            button1Props={{
              onClick: () => {
                if (!docData) {
                  setSaveEmptyFieldsPopupOpen(true);
                  return;
                }

                updateFormMutation.mutate(
                  { host, id, docData },
                  {
                    onSuccess: () => {
                      router.back();
                    },
                  },
                );
                setSavePopupOpen(false);
              },
              text1: 'SAVE',
              backgroundColor: 'bg-rehua-green',
              iconProps: { name: 'save' },
            }}
            button2Props={{
              onClick: () => {
                setSavePopupOpen(false);
              },
              text1: 'GO BACK',
              backgroundColor: 'bg-rehua-red',
              iconProps: { name: 'circle-arrow' },
            }}
            modalProps={{ open: savePopupOpen }}
          />

          {/* Exit PopUp */}
          <PopUp
            isAlertPopup
            text1={'Are you sure you\nwant to leave this page?'}
            button1Props={{
              onClick: () => {
                setExitPopupOpen(false);
              },
              text1: 'STAY',
              backgroundColor: 'bg-rehua-green',
              iconProps: { name: 'circle-arrow' },
            }}
            button2Props={{
              onClick: () => {
                router.back();
              },
              text1: 'LEAVE',
              backgroundColor: 'bg-rehua-red',
              iconProps: { name: 'circle-arrow' },
            }}
            modalProps={{ open: exitPopupOpen }}
          />

          {/* Save with no changes PopUp */}
          <PopUp
            isAlertPopup
            text1={'Please make any changes before saving.'}
            button1Props={{
              onClick: () => {
                setSaveEmptyFieldsPopupOpen(false);
              },
              text1: 'OK',
              backgroundColor: 'bg-rehua-green',
              iconProps: { name: 'circle-arrow' },
            }}
            modalProps={{ open: saveEmptyFieldsPopupOpen }}
          />

          <div className={`flex flex-wrap items-center gap-3 px-4 py-3`}>
            <ContentButton
              type="button"
              iconProps={{ name: 'circle-arrow' }}
              foregroundColor="text-rehua-navy"
              backgroundColor="bg-rehua-white"
              height={72}
              style={{
                boxShadow: 'none',
              }}

              onClick={() => {
                setExitPopupOpen(true);
              }}
            />

            <div className="flex min-w-0 items-center gap-3">
              <Icon
                name="folder-open"
                width={61}
                className="shrink-0 text-rehua-black"
              />
              <span
                className={`
                  truncate text-[35px] leading-none font-bold text-rehua-black
                `}
              >
                {data.template.templateName}
              </span>
            </div>

            <div
              className={`
                ml-0 flex min-w-0 flex-1 flex-row flex-wrap items-center
                justify-end gap-3
              `}
            >
              <div className="min-w-0">
                <DropdownBar
                  options={[
                    // TODO: Fetch tags from API
                    'Tag 1',
                    'Tag 2',
                    'Tag 3',
                  ]}
                  selectedValues={currentData.tags}
                  multiple
                  onChange={(d) => {
                    setDocData((prev) => ({
                      ...(prev ?? data),
                      tags: d,
                    }));
                  }}
                  defaultText="Select document tags"
                />
              </div>
              <ContentButton
                type="button"
                text1="Save"
                text2="Document"
                iconProps={{ name: 'save' }}
                iconPosition="left"
                textAlign="right"
                foregroundColor="text-rehua-white"
                backgroundColor="bg-rehua-green"
                height={50}
                onClick={() => {
                  setSavePopupOpen(true);
                }}
              />
            </div>
          </div>

          <div className="flex flex-1 px-4 py-10">
            <FormTemplate
              schema={data.template.schema}
              uiSchema={data.template.uiSchema}
              formData={currentData.data}
              onChange={(e) => {
                setDocData((prev) => ({
                  ...(prev ?? data),
                  data: e.formData,
                }));
              }}
              className="flex w-full flex-col"
            />
          </div>
        </div>
      </Surface>
    </div>
  );
}
