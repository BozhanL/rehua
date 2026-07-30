import FormTemplate from './FormTemplate';
import ContentButton from '@/app/components/ContentButton';
import Icon from '@/app/components/Icon';
import Modal from '@/app/components/Modal';
import type { IChangeEvent } from '@rjsf/core';
import {
  mergeObjects,
  mergeSchemas,
  type RJSFSchema,
  type UiSchema,
} from '@rjsf/utils';
import type { JSONSchema7Definition } from 'json-schema';
import { useMemo, useState, type JSX } from 'react';
import type { ReadonlyDeep, StructuredCloneable } from 'type-fest';
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

const defaultSectionSchema: ReadonlyDeep<SectionSchema[]> = Object.freeze([
  {
    id: 'normal-string',
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
    id: 'textarea-string',
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
    id: 'radio',
    displaySchema: mergeSchemas(defaultDisplaySchema, {
      properties: {
        json: {
          required: ['enum'],
          properties: {
            enum: {
              type: 'array',
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
    id: 'checkboxes',
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
                  title: 'items',
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
    id: 'description-text',
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
      'ui:options': {},
    },
  },
] as const) satisfies StructuredCloneable;

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

  const sectionSchema = useMemo(
    () => structuredClone(defaultSectionSchema) as unknown as SectionSchema[],
    [],
  );

  return (
    <Modal open={open}>
      <div className="flex h-full flex-col gap-4 p-4">
        {/* Modal Header */}
        <div className="flex text-rehua-maroon">
          <ContentButton
            type="button"
            iconProps={{ name: 'circle-arrow' }}

            foregroundColor="text-rehua-navy"
            backgroundColor="bg-transparent"
            style={{ boxShadow: 'none' }}

            onClick={() => {
              onClose();

              setFormData({});
            }}
          />
          <Icon name="file" />
          <h2>Add New Section to Template</h2>
        </div>

        <ol className="divide-y overflow-y-auto">
          {sectionSchema.map((section) => (
            <li key={section.id}>
              <FormTemplate
                schema={mergeSchemas(section.displaySchema, {
                  properties: {
                    preview: mergeSchemas(
                      section.sectionSchema,
                      formData[section.id]?.json ?? {},
                    ),
                  },
                })}
                uiSchema={mergeObjects(section.displayUiSchema, {
                  preview: {
                    ...section.sectionUiSchema,
                    'ui:options': mergeObjects(
                      section.sectionUiSchema['ui:options'] ?? {},
                      formData[section.id]?.ui ?? {},
                    ),
                  },
                })}
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
                      section.sectionUiSchema['ui:options'] ?? {},
                      formData[section.id]?.ui ?? {},
                    ),
                  };

                  onSubmit(crypto.randomUUID(), schema, uiSchema);

                  setFormData({});
                }}
              />
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
