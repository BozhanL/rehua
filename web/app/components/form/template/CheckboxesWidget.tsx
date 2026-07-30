import CheckboxGroup from '@/app/components/CheckboxGroup';
import type {
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
  WidgetProps,
} from '@rjsf/utils';
import type { JSX } from 'react';
import typia from 'typia';

export default function CheckboxesWidget<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>(props: Readonly<WidgetProps<T, S, F>>): JSX.Element {
  const { options, readonly, disabled, onChange } = props;
  const value = props.value as unknown;

  return (
    <CheckboxGroup
      options={
        options.enumOptions?.map((option) =>
          typia.assert<string>(option.value ?? ''),
        ) ?? []
      }
      selectedBoxes={typia.assert<string[]>(value ?? [])}
      onChange={onChange}
      disabled={readonly || disabled}
    />
  );
}
