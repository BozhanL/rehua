import AddButton from './AddButton';
import { MoveDownButton, MoveUpButton, RemoveButton } from './IconButton';
import SubmitButton from './SubmitButton';
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
} from '@rjsf/utils';

export function generateButtonTemplates<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>(): Partial<TemplatesType<T, S, F>['ButtonTemplates']> {
  const ButtonTemplates: Partial<TemplatesType<T, S, F>['ButtonTemplates']> = {
    SubmitButton,
    AddButton,
    MoveDownButton,
    MoveUpButton,
    RemoveButton,
  };

  return ButtonTemplates;
}

export default generateButtonTemplates();
