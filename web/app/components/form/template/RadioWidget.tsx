import RadioGroup from '@/app/components/RadioGroup';
import type {
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  WidgetProps,
} from '@rjsf/utils';
import type { JSX } from 'react';
import typia from 'typia';

export default function RadioWidget<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  id,
  htmlName,
  options,
  readonly,
  disabled,
  onChange,
  value,
}: Readonly<WidgetProps<T, S, F>>): JSX.Element {
  return (
    <RadioGroup
      radioGroupName={htmlName ?? id}
      options={
        options.enumOptions?.map((option) => ({
          buttonOption: typia.assert<string>(option.value ?? ''),
          buttonLabel: option.label,
        })) ?? []
      }
      selectedButton={typia.assert<string | undefined>(value)}
      onChange={onChange}
      disabled={readonly || disabled}
    />
  );
}
