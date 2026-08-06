import SingleLineInput from '@/app/components/SingleLineInput';
import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  type BaseInputTemplateProps,
  getInputProps,
} from '@rjsf/utils';
import type { JSX } from 'react';
import typia from 'typia';

export default function BaseInputTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  readonly,
  disabled,
  type,
  value,
  onChange,
  options,
  schema,

  // Discarded props that are not used in this template
  onFocus: _onFocus,
  onBlur: _onBlur,
  uiSchema: _uiSchema,
  htmlName: _htmlName,
  rawErrors: _rawErrors,
  autofocus: _autofocus,
  hideError: _hideError,
  hideLabel: _hideLabel,

  ...textFieldProps
}: Readonly<BaseInputTemplateProps<T, S, F>>): JSX.Element {
  const p = getInputProps<T, S, F>(
    schema,
    typia.assert<string | undefined>(type),
    options,
  );

  return (
    <SingleLineInput
      disabled={disabled || readonly}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      value={String(value ?? '')}
      {...p}
      {...textFieldProps}
    />
  );
}
