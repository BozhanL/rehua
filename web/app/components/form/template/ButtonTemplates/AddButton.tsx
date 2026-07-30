import ContentButton from '@/app/components/ContentButton';
import {
  TranslatableString,
  type FormContextType,
  type IconButtonProps,
  type RJSFSchema,
  type StrictRJSFSchema,
} from '@rjsf/utils';
import type { JSX } from 'react';

export default function AddButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  uiSchema: _,
  registry,
  ...props
}: Readonly<IconButtonProps<T, S, F>>): JSX.Element {
  const { translateString } = registry;

  return (
    <ContentButton
      text1={translateString(TranslatableString.AddItemButton)}
      iconProps={{ name: 'plus' }}
      foregroundColor="text-rehua-dark-green"
      backgroundColor="bg-transparent"
      style={{ boxShadow: 'none' }}
      {...props}
    />
  );
}
