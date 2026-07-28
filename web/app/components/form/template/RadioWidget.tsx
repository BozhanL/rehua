import RadioGroup from '@/app/components/RadioGroup';
import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  type WidgetProps,
  labelValue,
} from '@rjsf/utils';
import type { JSX } from 'react';
import typia from 'typia';

export default function RadioWidgett<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>(props: Readonly<WidgetProps<T, S, F>>): JSX.Element {
  const { id, htmlName, label, options, hideLabel, readonly, onChange } = props;
  const value = props.value as unknown;

  return (
    <>
      {labelValue(<h2>{label || undefined}</h2>, hideLabel)}
      <RadioGroup
        radioGroupName={htmlName ?? id}
        options={options.enumOptions?.map((option) => ({
          buttonOption: typia.assert<string>(option.value ?? option.label),
          buttonLabel: option.label,
        }))}
        selectedButton={typia.assert<string | undefined>(value)}
        onChange={readonly ? undefined : onChange}
      />
    </>
  );
}
