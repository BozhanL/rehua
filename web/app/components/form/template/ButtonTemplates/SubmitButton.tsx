import ContentButton from '@/app/components/ContentButton';
import {
  getSubmitButtonOptions,
  type FormContextType,
  type RJSFSchema,
  type StrictRJSFSchema,
  type SubmitButtonProps,
} from '@rjsf/utils';
import type { JSX } from 'react/jsx-runtime';

export default function SubmitButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({ uiSchema }: Readonly<SubmitButtonProps<T, S, F>>): JSX.Element {
  const { norender, props: submitButtonProps = {} } = getSubmitButtonOptions<
    T,
    S,
    F
  >(uiSchema);

  if (norender) {
    return <></>;
  }

  return (
    <ContentButton
      type="submit"
      iconProps={{ name: 'plus' }}
      foregroundColor="text-rehua-dark-green"
      backgroundColor="bg-transparent"
      style={{ boxShadow: 'none' }}
      {...submitButtonProps}
    />
  );
}
