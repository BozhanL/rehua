import { generateTheme } from './template';
import type { MakeOptional } from '@/app/utils/types';
import { type FormProps, withTheme } from '@rjsf/core';
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { useMemo, type JSX } from 'react';

export type FormTemplateProps<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
> = MakeOptional<FormProps<T, S, F>, 'validator'>;

export default function FormTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({ validator, ...prop }: Readonly<FormTemplateProps<T, S, F>>): JSX.Element {
  const FormWithTheme = useMemo(() => withTheme(generateTheme<T, S, F>()), []);
  const defaultValidator = useMemo(() => customizeValidator<T, S, F>(), []);

  return (
    // eslint-disable-next-line react-hooks/static-components
    <FormWithTheme validator={validator ?? defaultValidator} {...prop} />
  );
}
