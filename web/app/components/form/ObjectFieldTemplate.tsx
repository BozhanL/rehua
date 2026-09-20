/*
  This template is not included in the default theme, but is used in the CreateTemplate page to allow users to add and remove sections from the form.
 */
import AddSectionModal from './AddSectionModal';
import ContentButton from '@/app/components/common/ContentButton';
import type { IconProps } from '@/app/components/common/Icon';
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

    // Do nothing if the section does not exist in the schema
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

    // Do nothing if the section does not exist in the schema
    if (order === undefined) {
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
  uiContent: UiSchema,

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

    return {
      ...prev,
      [name]: uiContent,
      'ui:order': order ? order.toSpliced(position, 0, name) : [name],
    };
  });
}

interface AddSectionButtonProps {
  flip?: IconProps['flip'];
  index: number;
  setAddPosition: Dispatch<SetStateAction<number | null>>;
}

function AddSectionButton({
  flip,
  index,
  setAddPosition,
}: Readonly<AddSectionButtonProps>): JSX.Element {
  return (
    <ContentButton
      type="button"
      iconProps={{ name: 'section-plus', flip }}

      foregroundColor="text-rehua-dark-green"
      backgroundColor="bg-transparent"
      style={{ boxShadow: 'none' }}

      onClick={() => {
        setAddPosition(index);
      }}
    />
  );
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
        onSave={(name, content, uiContent) => {
          const trimedName = name.trim();

          if (
            addPosition === null ||
            !trimedName ||
            templates.includes(trimedName)
          ) {
            return;
          }

          addSection(
            addPosition,
            trimedName,
            content,
            uiContent,
            setSchema,
            setUiSchema,
          );

          setAddPosition(null);
        }}
      />

      {props.properties.map((element, index) => (
        <div key={element.name}>
          {index === 0 && (
            <AddSectionButton index={index} setAddPosition={setAddPosition} />
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1">{element.content}</div>

            <ContentButton
              type="button"
              iconProps={{ name: 'trash' }}

              foregroundColor="text-rehua-red"
              backgroundColor="bg-transparent"
              style={{ boxShadow: 'none' }}

              onClick={() => {
                removeSection(element.name, setSchema, setUiSchema);
              }}
            />
          </div>

          <AddSectionButton
            flip="vertical"
            index={index + 1}
            setAddPosition={setAddPosition}
          />
        </div>
      ))}

      {props.properties.length === 0 && (
        <div
          className={`
            mx-auto flex min-h-full max-w-3xl flex-1 flex-col items-center
            justify-center gap-8 px-6 py-24 text-center
          `}
        >
          <span
            className={`text-[50px] leading-tight font-bold text-rehua-navy`}
          >
            Click the button below to get started on your new template:
          </span>

          <ContentButton
            type="button"
            text1="Add"
            text2="Section"
            iconProps={{ name: 'section-plus' }}
            iconPosition="left"
            textAlign="right"
            height={56}
            foregroundColor="text-rehua-white"
            backgroundColor="bg-rehua-blue"
            onClick={() => {
              setAddPosition(0);
            }}
          />
        </div>
      )}
    </>
  );
}
