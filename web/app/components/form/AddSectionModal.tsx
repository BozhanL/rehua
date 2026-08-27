import FormTemplate from './FormTemplate';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import Modal from '@/app/components/common/Modal';
import type { IChangeEvent } from '@rjsf/core';
import {
  getUiOptions,
  mergeObjects,
  mergeSchemas,
  type RJSFSchema,
  type UiSchema,
} from '@rjsf/utils';
import type { JSONSchema7Definition } from 'json-schema';
import { useState, type JSX } from 'react';
import type { StructuredCloneable } from 'type-fest';
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

const defaultDisplayUiSchema = {
  json: {
    'ui:options': {
      title: false,
    },
  },
  ui: {
    'ui:options': {
      title: false,
    },
  },
} as const satisfies UiSchema;

const defaultDisplaySchema = {
  type: 'object',
  properties: {
    json: {
      type: 'object',
      required: ['title'],

      properties: {
        title: {
          type: 'string',
          title: 'Name of this section',
        },
      },
    },
  },
} as const satisfies RJSFSchema;

const sectionSchema = Object.freeze([
  {
    id: 'Single line text',

    displaySchema: defaultDisplaySchema,
    displayUiSchema: {
      ...defaultDisplayUiSchema,
    },

    sectionSchema: {
      type: 'string',
    },
    sectionUiSchema: {},
  },

  {
    id: 'Multi line text',

    displaySchema: mergeSchemas(defaultDisplaySchema, {
      properties: {
        ui: {
          type: 'object',
          required: ['rows'],
          properties: {
            rows: {
              type: 'integer',
              title: 'Number of rows',
              minimum: 1,
              default: 5,
            },
          },
        },
      },
    }),
    displayUiSchema: {
      ...defaultDisplayUiSchema,
    },

    sectionSchema: {
      type: 'string',
    },
    sectionUiSchema: {
      'ui:widget': 'textarea',
    },
  },

  {
    id: 'Radio buttons',

    displaySchema: mergeSchemas(defaultDisplaySchema, {
      properties: {
        json: {
          required: ['enum'],
          properties: {
            enum: {
              type: 'array',
              title: 'option',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    }),
    displayUiSchema: {
      ...defaultDisplayUiSchema,
    },

    sectionSchema: {
      type: 'string',
    },
    sectionUiSchema: {
      'ui:widget': 'radio',
    },
  },

  {
    id: 'Checkbox',

    displaySchema: mergeSchemas(defaultDisplaySchema, {
      properties: {
        json: {
          required: ['items'],
          properties: {
            items: {
              type: 'object',
              required: ['enum'],
              properties: {
                enum: {
                  type: 'array',
                  uniqueItems: true,
                  title: 'option',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    }),
    displayUiSchema: mergeObjects(defaultDisplayUiSchema, {
      json: {
        items: {
          'ui:options': {
            title: false,
          },
        },
      },
    }),

    sectionSchema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    sectionUiSchema: {
      'ui:widget': 'checkboxes',
    },
  },

  {
    id: 'Description text',

    displaySchema: mergeSchemas(defaultDisplaySchema, {
      properties: {
        json: {
          properties: {
            title: {
              title: 'Content of this section',
            },
          },
        },
      },
    }),
    displayUiSchema: {
      ...defaultDisplayUiSchema,
    },

    sectionSchema: {
      type: 'null',
    },
    sectionUiSchema: {
      'ui:disabled': true,
    },
  },
] as const) satisfies StructuredCloneable | SectionSchema;

export default function AddSectionModal({
  open,
  onCancel: onClose,
  onSave: onSubmit,
}: Readonly<AddSectionModalProps>): JSX.Element {
  const [formData, setFormData] = useState<
    Record<
      string,
      {
        json: Record<string, unknown> | undefined;
        ui?: Record<string, unknown> | undefined;
      }
    >
  >({});

  return (
    <Modal open={open}>
      <div className="flex h-full flex-col gap-6 p-4">
        {/* Modal Header */}
        <div className="flex items-center gap-4 text-rehua-maroon">
          <ContentButton
            type="button"
            iconProps={{ name: 'circle-arrow' }}

            foregroundColor="text-rehua-navy"
            backgroundColor="bg-transparent"
            style={{ boxShadow: 'none' }}

            height={60}

            onClick={() => {
              onClose();

              setFormData({});
            }}
          />
          <Icon name="file" width={40} />
          <h2 className="text-[32px] leading-none font-bold">
            Add New Section to Template
          </h2>
        </div>

        <ol className={`divide-y overflow-y-auto pl-6`}>
          {sectionSchema.map((section) => (
            <li key={section.id} className="py-8">
              <h3
                className={`text-[26px] leading-none font-bold text-rehua-black`}
              >
                {section.id}
              </h3>

              {/* the form is a flex row so that its submit button (the green plus) is rendered on the right side of the section content */}
              <FormTemplate
                className={`
                  mt-4 flex items-start gap-6
                  [&>fieldset]:min-w-0 [&>fieldset]:flex-1
                `}
                showErrorList={false}
                schema={section.displaySchema}
                uiSchema={section.displayUiSchema}
                formData={formData[section.id] ?? {}}
                onChange={({ formData: newFormData }: IChangeEvent) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    [section.id]:
                      typia.assert<(typeof prevFormData)[string]>(newFormData),
                  }));
                }}
                onSubmit={() => {
                  const schema: RJSFSchema = mergeSchemas(
                    section.sectionSchema,
                    formData[section.id]?.json ?? {},
                  );
                  const uiSchema: UiSchema = {
                    ...section.sectionUiSchema,
                    'ui:options': mergeObjects(
                      getUiOptions(section.sectionUiSchema),
                      formData[section.id]?.ui ?? {},
                    ),
                  };

                  onSubmit(crypto.randomUUID(), schema, uiSchema);

                  setFormData({});
                }}
              />

              {/* dashed line separating the section configuration from its preview */}
              <hr className="my-4 border-t-2 border-dashed border-rehua-dark-gray" />

              <FormTemplate
                readonly
                schema={{
                  type: 'object',
                  properties: {
                    preview: mergeSchemas(
                      section.sectionSchema,
                      formData[section.id]?.json ?? {},
                    ),
                  },
                }}
                uiSchema={{
                  preview: {
                    ...section.sectionUiSchema,
                    'ui:options': mergeObjects(
                      getUiOptions(section.sectionUiSchema),
                      formData[section.id]?.ui ?? {},
                    ),
                  },
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
