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

const sectionSchema: readonly SectionSchema[] = [
  {
    id: 'normal-string',
    displaySchema: {
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
    },
    displayUiSchema: {
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
    },

    sectionSchema: {
      type: 'string',
    },
    sectionUiSchema: {},
  },

  {
    id: 'textarea-string',
    displaySchema: {
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
    },
    displayUiSchema: {
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
    displaySchema: {
      type: 'object',
      properties: {
        json: {
          type: 'object',
          required: ['title', 'enum'],

          properties: {
            title: {
              type: 'string',
              title: 'Name of this section',
            },

            enum: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },

        ui: {
          type: 'object',
          required: ['inline'],
          properties: {
            inline: {
              type: 'boolean',
              title: 'Display inline',
              default: true,
            },
          },
        },
      },
    },
    displayUiSchema: {
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
    displaySchema: {
      type: 'object',
      properties: {
        json: {
          type: 'object',
          required: ['title', 'items'],

          properties: {
            title: {
              type: 'string',
              title: 'Name of this section',
            },

            items: {
              type: 'object',
              required: ['enum'],
              properties: {
                enum: {
                  type: 'array',
                  title: 'items',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },

        ui: {
          type: 'object',
          required: ['inline'],
          properties: {
            inline: {
              type: 'boolean',
              title: 'Display inline',
              default: true,
            },
          },
        },
      },
    },
    displayUiSchema: {
      json: {
        'ui:options': {
          title: false,
        },
        items: {
          'ui:options': {
            title: false,
          },
        },
      },
      ui: {
        'ui:options': {
          title: false,
        },
      },
    },

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
    displaySchema: {
      type: 'object',
      properties: {
        json: {
          type: 'object',
          required: ['title'],

          properties: {
            title: {
              type: 'string',
              title: 'Content of this section',
            },
          },
        },
      },
    },
    displayUiSchema: {
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
    },

    sectionSchema: {
      type: 'string',
    },
    sectionUiSchema: {
      'ui:disabled': true,
      // TODO: add a custom widget for description text
    },
  },
];

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
      <div className="flex h-full flex-col gap-4 p-4">
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

        <ol className="divide-y overflow-y-auto">
          {sectionSchema.map((section) => (
            <li key={section.id}>
              <FormTemplate
                schema={section.displaySchema}
                uiSchema={section.displayUiSchema}
                formData={formData[section.id] ?? {}}
                onChange={({ formData: newFormData }: IChangeEvent) => {
                  console.log({
                    type: 'object',
                    properties: {
                      preview: mergeSchemas(
                        section.sectionSchema,
                        formData[section.id]?.json ?? {},
                      ),
                    },
                  });
                  console.log({
                    preview: {
                      ...section.sectionUiSchema,
                      'ui:options': mergeObjects(
                        section.sectionUiSchema['ui:options'] ?? {},
                        formData[section.id]?.ui ?? {},
                      ),
                    },
                    'ui:submitButtonOptions': {
                      norender: true,
                    },
                  });

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
                      section.sectionUiSchema['ui:options'] ?? {},
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
