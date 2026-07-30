import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import { generateButtonTemplates } from './ButtonTemplates';
import CheckboxesWidget from './CheckboxesWidget';
import RadioWidget from './RadioWidget';
import type { ThemeProps as DefaultThemeProps } from '@rjsf/core';
import type {
  StrictRJSFSchema,
  RJSFSchema,
  FormContextType,
} from '@rjsf/utils';
import type { SetRequired } from 'type-fest';

type ThemeProps<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
> = SetRequired<DefaultThemeProps<T, S, F>, 'widgets' | 'templates' | 'fields'>;

export function generateTheme<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>(): DefaultThemeProps<T, S, F> {
  const ButtonTemplates = generateButtonTemplates<T, S, F>();

  const theme: ThemeProps<T, S, F> = {
    widgets: {
      RadioWidget,
      CheckboxesWidget,
    },
    templates: {
      ArrayFieldTemplate,
      ArrayFieldItemTemplate,
      ButtonTemplates,
    },
    fields: {},
  };

  return theme;
}

export default generateTheme();
