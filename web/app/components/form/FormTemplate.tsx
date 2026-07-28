import theme from './template';
import type { MakeOptional } from '@/app/utils/types';
import type FormType from '@rjsf/core';
import { type FormProps, withTheme } from '@rjsf/core';
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  ValidatorType,
} from '@rjsf/utils';
import defaultValidator from '@rjsf/validator-ajv8';
import type { JSX } from 'react';

export type FormTemplateProps<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
> = MakeOptional<FormProps<T, S, F>, 'validator'>;

const FormWithTheme = withTheme(theme) as typeof FormType;

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
