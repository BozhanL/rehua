import ContentButton, {
  type ContentButtonProps,
} from '@/app/components/common/ContentButton';
import type {
  FormContextType,
  IconButtonProps,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import type { JSX } from 'react';

type MoveButtonProps<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
> = Omit<IconButtonProps<T, S, F>, 'registry' | 'uiSchema'> &
  Pick<ContentButtonProps, 'iconProps' | 'foregroundColor'>;

function IconButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  foregroundColor = 'text-rehua-dark-green',
  ...props
}: Readonly<MoveButtonProps<T, S, F>>): JSX.Element {
  return (
    <ContentButton
      foregroundColor={foregroundColor}
      backgroundColor="bg-transparent"
      height={25}
      style={{ boxShadow: 'none' }}
      {...props}
    />
  );
}

export function MoveDownButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  uiSchema: _uiSchema,
  registry: _registry,
  ...props
}: Readonly<IconButtonProps<T, S, F>>): JSX.Element {
  return (
    <IconButton iconProps={{ name: 'simple-arrow', rotation: 90 }} {...props} />
  );
}

export function MoveUpButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  uiSchema: _uiSchema,
  registry: _registry,
  ...props
}: Readonly<IconButtonProps<T, S, F>>): JSX.Element {
  return (
    <IconButton
      iconProps={{ name: 'simple-arrow', rotation: -90 }}
      {...props}
    />
  );
}

export function RemoveButton<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  uiSchema: _uiSchema,
  registry: _registry,
  ...props
}: Readonly<IconButtonProps<T, S, F>>): JSX.Element {
  return (
    <IconButton
      iconProps={{ name: 'trash' }}
      foregroundColor="text-rehua-red"
      {...props}
    />
  );
}
