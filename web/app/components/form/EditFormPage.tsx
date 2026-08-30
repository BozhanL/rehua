'use client';

import ContentButton from '@/app/components/common/ContentButton';
import DropdownBar from '@/app/components/common/DropdownBar';
import Icon from '@/app/components/common/Icon';
import PopUp from '@/app/components/common/PopUp';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import FormTemplate, {
  ObjectFieldTemplate,
  type ObjectFieldTemplateContext,
} from '@/app/components/form';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import {
  TemplateDocumentTypeValues,
  type TemplateDocumentType,
} from '@/app/utils/types';
import { create as createTemplateSDK } from '@rehua/sdk/functional/templates';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';

async function createTemplate({
  host,
  templateName,
  templateType,
  schema,
  uiSchema,
}: {
  host: string;
  templateName: string;
  templateType: TemplateDocumentType[];
  schema: RJSFSchema;
  uiSchema: UiSchema;
}): Promise<createTemplateSDK.Output> {
  return createTemplateSDK(
    { host, simulate: isTesting },
    { templateName, templateType, schema, uiSchema },
  );
}

interface EditFormPageProps {
  title: string;

  defaultTemplateName?: string;
  defaultTemplateType?: TemplateDocumentType[];
  defaultSchema: RJSFSchema;
  defaultUiSchema: UiSchema;
}

export default function EditFormPage({
  title,

  defaultTemplateName,
  defaultTemplateType,
  defaultSchema,
  defaultUiSchema,
}: Readonly<EditFormPageProps>): JSX.Element {
  const [savePopupOpen, setSavePopupOpen] = useState<boolean>(false);
  const [exitPopupOpen, setExitPopupOpen] = useState<boolean>(false);
  const [saveEmptyFieldsPopupOpen, setSaveEmptyFieldsPopupOpen] =
    useState<boolean>(false);

  const [formData, setFormData] = useState<unknown>(undefined);
  const [templateName, setTemplateName] = useState(defaultTemplateName ?? '');
  const [templateType, setTemplateType] = useState<TemplateDocumentType[]>(
    defaultTemplateType ?? [],
  );
  const [schema, setSchema] = useState<RJSFSchema>(defaultSchema);
  const [uiSchema, setUiSchema] = useState<UiSchema>(defaultUiSchema);

  const router = useRouter();

  const host = useContext(APIUrlContext);

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
  });

  return (
    <>
      {/* Save Template PopUp */}
      <PopUp
        isAlertPopup
        text1={`Are you sure you want to create\nthe following document template:\n“${templateName}”, type “${templateType.join(', ')}”`}
        button1Props={{
          onClick: () => {
            createTemplateMutation.mutate(
              { host, templateName, templateType, schema, uiSchema },
              {
                onSuccess: (resp) => {
                  const searchParams = new URLSearchParams();
                  searchParams.append('id', resp._id);
                  router.push(`/templates?${searchParams.toString()}`);
                },
              },
            );
            setSavePopupOpen(false);
          },
          text1: 'CREATE',
          text2: 'TEMPLATE',
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

      {/* Exit without saving PopUp */}
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

      {/* Save with empty fields PopUp */}
      <PopUp
        isAlertPopup
        text1={
          'Please fill in the template name and select at least one template type before saving.'
        }
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
            {title}
          </span>
        </div>

        <div
          className={`
            ml-0 flex min-w-0 flex-1 flex-row flex-wrap items-center justify-end
            gap-3
          `}
        >
          <div className="min-w-0 flex-1">
            <SingleLineInput
              aria-label="Template name"
              placeholder="Enter New Template Name here . . ."
              value={templateName}
              onChange={(event) => {
                setTemplateName(event.currentTarget.value);
              }}
            />
          </div>

          <DropdownBar
            options={TemplateDocumentTypeValues}
            selectedValues={templateType}
            multiple
            onChange={setTemplateType}
            defaultText="Template Type"
          />

          <ContentButton
            type="button"
            text1="Save"
            text2="Template"
            iconProps={{ name: 'save' }}
            iconPosition="left"
            textAlign="right"
            foregroundColor="text-rehua-white"
            backgroundColor="bg-rehua-green"
            height={50}
            onClick={() => {
              if (templateName === '' || templateType.length === 0) {
                setSaveEmptyFieldsPopupOpen(true);
                return;
              }

              setSavePopupOpen(true);
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 px-4 py-10">
        <FormTemplate<
          unknown,
          RJSFSchema,
          { objectFieldTemplate: ObjectFieldTemplateContext }
        >
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          onChange={(e) => {
            setFormData(e.formData);
          }}
          templates={{ ObjectFieldTemplate }}
          formContext={{
            objectFieldTemplate: {
              templates: uiSchema['ui:order'] ?? [],
              setSchema,
              setUiSchema,
            },
          }}
          className="flex w-full flex-col"
        />
      </div>
    </>
  );
}
