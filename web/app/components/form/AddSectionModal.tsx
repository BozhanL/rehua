import FormTemplate from './FormTemplate';
import ContentButton from '@/app/components/ContentButton';
import Icon from '@/app/components/Icon';
import Modal from '@/app/components/Modal';
import type { IChangeEvent } from '@rjsf/core';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import type { JSONSchema7Definition } from 'json-schema';
import { useState, type JSX } from 'react';
import typia from 'typia';

interface AddSectionModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (
    name: string,
    content: JSONSchema7Definition,
    uiContent: UiSchema,
  ) => void;
}

interface SectionSchema {
  id: string;

  displaySchema: RJSFSchema;
  displayUiSchema: UiSchema;

  sectionSchema: RJSFSchema;
  sectionUiSchema: UiSchema;
}

const sectionSchema = [
  {
    id: 'normal-string',
    displaySchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          title: 'Name of this section',
        },
      },
    },
    displayUiSchema: {},

    sectionSchema: {
      type: 'string',
      title: 'Name of this section',
    },
    sectionUiSchema: {},
  },

  {
    id: 'textarea-string',
    displaySchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          title: 'Name of this section',
        },
      },
    },
    displayUiSchema: {},

    sectionSchema: {
      type: 'string',
      title: 'Name of this section',
    },
    sectionUiSchema: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5, // Maps directly to MUI's TextField rows prop
      },
    },
  },
] as const satisfies readonly SectionSchema[];

export default function AddSectionModal({
  open,
  onCancel: onClose,
  onSave: onSubmit,
}: Readonly<AddSectionModalProps>): JSX.Element {
  const [formData, setFormData] = useState<
    Record<string, { name: string | undefined }>
  >({});

  return (
    <Modal open={open}>
      <div className="flex flex-col gap-4 p-4">
        {/* Modal Header */}
        <div className="flex text-rehua-maroon">
          <ContentButton
            type="button"
            iconProps={{ name: 'circle-arrow' }}

            foregroundColor="text-rehua-navy"
            backgroundColor="transparent"
            style={{ boxShadow: 'none' }}

            onClick={() => {
              onClose();

              setFormData({});
            }}
          />
          <Icon name="file" />
          <h2>Add New Section to Template</h2>
        </div>

        <ol>
          {sectionSchema.map((section) => (
            <li key={section.id}>
              <FormTemplate
                schema={section.displaySchema}
                uiSchema={section.displayUiSchema}
                formData={formData[section.id] ?? {}}
                onChange={({ formData: newFormData }: IChangeEvent) => {
                  console.log('formData', newFormData);
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    [section.id]:
                      typia.assert<(typeof prevFormData)[string]>(newFormData),
                  }));
                }}
                onSubmit={() => {
                  const schema: RJSFSchema = {
                    ...section.sectionSchema,
                    title: formData[section.id]?.name,
                  };
                  const uiSchema: UiSchema = { ...section.sectionUiSchema };

                  onSubmit(crypto.randomUUID(), schema, uiSchema);

                  setFormData({});
                }}
              />

              <FormTemplate
                readonly
                schema={{
                  type: 'object',
                  required: ['name'],
                  properties: {
                    preview: {
                      ...section.sectionSchema,
                      title: formData[section.id]?.name,
                    },
                  },
                }}
                uiSchema={{
                  preview: section.sectionUiSchema,
                  'ui:submitButtonOptions': {
                    norender: true,
                  },
                }}
              />
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
