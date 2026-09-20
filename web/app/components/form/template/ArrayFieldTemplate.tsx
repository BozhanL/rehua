import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  type ArrayFieldTemplateProps,
  getTemplate,
  getUiOptions,
  buttonId,
} from '@rjsf/utils';
import { useMemo, type JSX } from 'react';

export default function ArrayFieldTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  canAdd,
  disabled,
  fieldPathId,
  uiSchema,
  items,
  optionalDataControl,
  onAddClick,
  readonly,
  registry,
  required,
  schema,
  title,
}: ArrayFieldTemplateProps<T, S, F>): JSX.Element {
  const uiOptions = useMemo(() => getUiOptions<T, S, F>(uiSchema), [uiSchema]);
  const ArrayFieldDescriptionTemplate = useMemo(
    () =>
      getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>(
        'ArrayFieldDescriptionTemplate',
        registry,
        uiOptions,
      ),
    [registry, uiOptions],
  );
  const ArrayFieldTitleTemplate = useMemo(
    () =>
      getTemplate<'ArrayFieldTitleTemplate', T, S, F>(
        'ArrayFieldTitleTemplate',
        registry,
        uiOptions,
      ),
    [registry, uiOptions],
  );

  const { AddButton } = registry.templates.ButtonTemplates;

  const showOptionalDataControlInTitle = !readonly && !disabled;

  return (
    <div>
      {/* eslint-disable-next-line react-hooks/static-components */}
      <ArrayFieldTitleTemplate
        fieldPathId={fieldPathId}
        title={uiOptions.title ?? title}
        schema={schema}
        uiSchema={uiSchema ?? {}}
        required={required ?? false}
        registry={registry}
        optionalDataControl={
          showOptionalDataControlInTitle ? optionalDataControl : undefined
        }
      />

      {/* eslint-disable-next-line react-hooks/static-components */}
      <ArrayFieldDescriptionTemplate
        fieldPathId={fieldPathId}
        description={uiOptions.description ?? schema.description ?? ''}
        schema={schema}
        uiSchema={uiSchema ?? {}}
        registry={registry}
      />

      {!showOptionalDataControlInTitle ? optionalDataControl : undefined}

      {items}

      {canAdd && (
        <AddButton
          id={buttonId(fieldPathId, 'add')}
          onClick={onAddClick}
          disabled={disabled || readonly}
          uiSchema={uiSchema ?? {}}
          registry={registry}
        />
      )}
    </div>
  );
}
