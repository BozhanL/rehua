import type FormType from '@rjsf/core';
import { type FormProps, withTheme } from '@rjsf/core';
import { generateTheme } from '@rjsf/mui';
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  ValidatorType,
} from '@rjsf/utils';
import defaultValidator from '@rjsf/validator-ajv8';
import type { JSX } from 'react';

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type FormTemplateProps<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
> = MakeRequired<
  MakeOptional<FormProps<T, S, F>, 'validator'>,
  'onChange' | 'formData'
>;

const FormWithTheme = withTheme(generateTheme()) as typeof FormType;

export default function FormTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({ validator, ...prop }: Readonly<FormTemplateProps<T, S, F>>): JSX.Element {
  return (
    <FormWithTheme
      validator={validator ?? (defaultValidator as ValidatorType<T, S, F>)}
      {...prop}
    />
  );
}
