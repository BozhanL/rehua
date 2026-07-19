import AddSectionModal from './AddSectionModal';
import ContentButton from '@/app/components/ContentButton';
import type {
  ObjectFieldTemplateProps,
  RJSFSchema,
  UiSchema,
} from '@rjsf/utils';
import type { JSONSchema7Definition } from 'json-schema';
import { useState, type Dispatch, type JSX, type SetStateAction } from 'react';
import typia from 'typia';

export interface ObjectFieldTemplateContext {
  templates: string[];
  setSchema: Dispatch<SetStateAction<RJSFSchema>>;
  setUiSchema: Dispatch<SetStateAction<UiSchema>>;
}

function removeSection(
  name: string,
  setSchema: Dispatch<SetStateAction<RJSFSchema>>,
  setUiSchema: Dispatch<SetStateAction<UiSchema>>,
): void {
  setSchema((prevSchema) => {
    const { [name]: removedSection, ...properties } =
      prevSchema.properties ?? {};

    if (removedSection === undefined) {
      return prevSchema;
    }

    return {
      ...prevSchema,
      properties,
    };
  });

  setUiSchema((prev) => {
    const order = prev['ui:order'];

    if (!order) {
      return prev;
    }

    return {
      ...prev,
      'ui:order': order.filter((item) => item !== name),
    };
  });
}

function addSection(
  position: number,

  name: string,
  content: JSONSchema7Definition,

  setSchema: Dispatch<SetStateAction<RJSFSchema>>,
  setUiSchema: Dispatch<SetStateAction<UiSchema>>,
): void {
  setSchema((prev) => ({
    ...prev,
    properties: {
      ...prev.properties,
      [name]: content,
    },
  }));

  setUiSchema((prev) => {
    const order = prev['ui:order'];

    if (!order) {
      return prev;
    }

    return {
      ...prev,
      'ui:order': order.toSpliced(position, 0, name),
    };
  });
}

export default function ObjectFieldTemplate(
  props: ObjectFieldTemplateProps,
): JSX.Element {
  const context: unknown = props.registry.formContext;
  typia.assertGuard<{ objectFieldTemplate: ObjectFieldTemplateContext }>(
    context,
  );
  const [addPosition, setAddPosition] = useState<number | null>(null);
  const { templates, setSchema, setUiSchema } = context.objectFieldTemplate;

  return (
    <>
      <AddSectionModal
        open={addPosition !== null}
        onCancel={() => {
          setAddPosition(null);
        }}
        onSave={(name, content) => {
          const trimedName = name.trim();

          if (
            addPosition === null ||
            !trimedName ||
            templates.includes(trimedName)
          ) {
            return;
          }

          addSection(addPosition, trimedName, content, setSchema, setUiSchema);

          setAddPosition(null);
        }}
      />

      {props.properties.map((element, index) => (
        <div key={element.name}>
          {index === 0 && (
            <ContentButton
              type="button"
              iconProps={{ name: 'section-plus' }}

              foregroundColor="text-rehua-green"
              backgroundColor="transparent"
              style={{ boxShadow: 'none' }}

              onClick={() => {
                setAddPosition(index);
              }}
            />
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1">{element.content}</div>

            <ContentButton
              type="button"
              iconProps={{ name: 'trash' }}

              foregroundColor="text-rehua-red"
              backgroundColor="transparent"
              style={{ boxShadow: 'none' }}

              onClick={() => {
                removeSection(element.name, setSchema, setUiSchema);
              }}
            />
          </div>

          <ContentButton
            type="button"
            iconProps={{ name: 'section-plus', flip: 'vertical' }}

            foregroundColor="text-rehua-green"
            backgroundColor="transparent"
            style={{ boxShadow: 'none' }}

            onClick={() => {
              setAddPosition(index + 1);
            }}
          />
        </div>
      ))}
    </>
  );
}
