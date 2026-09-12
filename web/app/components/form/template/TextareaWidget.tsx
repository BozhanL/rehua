import MultiLineInput from '@/app/components/common/MultiLineInput';
import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  type WidgetProps,
  ariaDescribedByIds,
} from '@rjsf/utils';
import type { JSX } from 'react';

export default function TextareaWidget<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  id,
  schema,
  htmlName,
  options,
  readonly,
  disabled,
  onChange,
  value,
}: Readonly<WidgetProps<T, S, F>>): JSX.Element {
  let rows: string | number = 5;
  if (typeof options.rows === 'string' || typeof options.rows === 'number') {
    rows = options.rows;
  }

  return (
    <MultiLineInput
      disabled={readonly || disabled}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={String(value ?? '')}
      rows={rows}
      id={id}
      name={htmlName ?? id}
      aria-describedby={ariaDescribedByIds(id, !!schema.examples)}
    />
  );
}
