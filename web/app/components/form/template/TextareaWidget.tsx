import MultiLineInput from '@/app/components/MultiLineInput';
import type {
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  WidgetProps,
} from '@rjsf/utils';
import type { JSX } from 'react';

export default function TextareaWidget<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
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
    />
  );
}
