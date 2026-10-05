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
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import {
  TemplateDocumentTypeValues,
  type TemplateDocumentType,
} from '@/app/utils/types';
import { create as createTemplateSDK } from '@rehua/sdk/functional/templates';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

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
    { host, simulate: isTesting, options: { credentials: 'include' } },
    { templateName, status: 'active', templateType, schema, uiSchema },
  );
}

interface EditFormPageProps {
  title: string;

  defaultTemplateName?: string;
  defaultTemplateType?: TemplateDocumentType[];
  defaultSchema: RJSFSchema;
  defaultUiSchema: UiSchema;
  mode: 'create' | 'edit'; // Change popups depending on mode
}

export default function EditFormPage({
  title,
  mode,
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

  const host = useApiUrl();

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
  });

  return (
    <>
      {/* Save Template PopUp */}
      <PopUp
        isAlertPopup
        text1={`Are you sure you want to ${mode === 'edit' ? 'save' : 'create'}\nthe following document template:\n“${templateName}”, type “${templateType.join(', ')}”`}
        button1Props={{
          onClick: () => {
            createTemplateMutation.mutate(
              { host, templateName, templateType, schema, uiSchema },
              {
                onSuccess: (resp) => {
                  const searchParams = new URLSearchParams();
                  searchParams.append('id', resp._id);
                  router.back();
                },
              },
            );
            setSavePopupOpen(false);
          },
          text1: mode === 'edit' ? 'SAVE' : 'CREATE',
          textAlign: 'right',
          text2: 'TEMPLATE',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'save', width: 0.5 },
          className: 'text-2xl',
        }}
        button2Props={{
          onClick: () => {
            setSavePopupOpen(false);
          },
          text1: 'GO BACK',
          backgroundColor: 'bg-rehua-red',
          iconProps: { name: 'circle-arrow', width: 0.6 },
          className: 'text-2xl',
        }}
        modalProps={{ open: savePopupOpen }}
      />

      {/* Exit without saving PopUp */}
      <PopUp
        isAlertPopup
        text1={'Are you sure you\nwant to leave this page?'}
        text2={<u>UNSAVED CHANGES WILL BE LOST</u>}
        text2ClassName={'text-rehua-ruby'}
        button1Props={{
          onClick: () => {
            setExitPopupOpen(false);
          },
          text1: 'STAY',
          iconProps: { name: 'circle-arrow', rotation: -90 },
          backgroundColor: 'bg-rehua-green',
          horizontalPadding: 0.5,
        }}
        button2Props={{
          onClick: () => {
            router.back();
          },
          text1: 'LEAVE',
          iconProps: { name: 'circle-arrow' },
          backgroundColor: 'bg-rehua-red',
          horizontalPadding: 0.4,
        }}
        modalProps={{ open: exitPopupOpen }}
      />

      {/* Save with empty fields PopUp */}
      <PopUp
        text1={
          'Please fill in the template name and \nselect at least one template type before saving.'
        }
        button1Props={{
          onClick: () => {
            setSaveEmptyFieldsPopupOpen(false);
          },
          text1: 'OK',
          backgroundColor: 'bg-rehua-green',
          iconProps: { name: 'circle-arrow' },
          textIconGap: 0.5,
        }}
        modalProps={{ open: saveEmptyFieldsPopupOpen }}
      />

      {/* title row: back button, title, template name, template type and save */}
      <div className="mx-6 mt-6 mb-5 overflow-x-auto">
        <div className="flex min-w-max items-center gap-3">
          {/* back button */}
          <ContentButton
            type="button"
            iconProps={{ name: 'circle-arrow' }}
            foregroundColor="text-rehua-navy"
            backgroundColor="bg-rehua-white"
            height={72}
            style={{ boxShadow: 'none' }}
            onClick={() => {
              setExitPopupOpen(true);
            }}
          />

          {/* page icon and title */}
          <div className="flex shrink-0 items-center gap-6">
            <Icon
              name="folder-open"
              width={61}
              className="shrink-0 text-rehua-black"
            />
            <span className="text-3xl font-bold text-rehua-black">{title}</span>
          </div>
          {/* right side */}
          <div className="ml-auto flex shrink-0 items-center gap-8">
            {/* template name input */}
            <div className="pl-5">
              <SingleLineInput
                aria-label="Template name"
                placeholder="Enter New Template Name here . . ."
                value={templateName}
                style={{ width: 350, height: 45 }}
                onChange={(event) => {
                  setTemplateName(event.currentTarget.value);
                }}
              />
            </div>
            {/* template type dropdown */}
            <DropdownBar
              options={TemplateDocumentTypeValues}
              selectedValues={templateType}
              multiple
              onChange={setTemplateType}
              defaultText="Template Type"
              width={250}
              size={20}
            />

            {/* save/create template button */}
            <ContentButton
              type="button"
              text1={mode === 'edit' ? 'Save' : 'Create'}
              text2="Template"
              iconProps={{ name: 'save' }}
              verticalPadding={0.2}
              horizontalPadding={0.5}
              lineHeight={1.1}
              textIconGap={0.4}
              iconPosition="left"
              textAlign="right"
              backgroundColor="bg-rehua-green"
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
      </div>

      {/* template body - preview display + add sections */}
      <div className="flex flex-1 p-10">
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
