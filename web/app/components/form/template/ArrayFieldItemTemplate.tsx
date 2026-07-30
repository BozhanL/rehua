import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  getTemplate,
  getUiOptions,
  type ArrayFieldItemTemplateProps,
} from '@rjsf/utils';
import type { JSX } from 'react';

export default function ArrayFieldItemTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>(props: ArrayFieldItemTemplateProps<T, S, F>): JSX.Element {
  const { children, buttonsProps, hasToolbar, uiSchema, className, registry } =
    props;

  const uiOptions = getUiOptions<T, S, F>(uiSchema);

  const ArrayFieldItemButtonsTemplate = getTemplate<
    'ArrayFieldItemButtonsTemplate',
    T,
    S,
    F
  >('ArrayFieldItemButtonsTemplate', registry, uiOptions);

  return (
    <div className={className}>
      {children}
      {hasToolbar && (
        // eslint-disable-next-line react-hooks/static-components
        <ArrayFieldItemButtonsTemplate {...buttonsProps} />
      )}
    </div>
  );
}
