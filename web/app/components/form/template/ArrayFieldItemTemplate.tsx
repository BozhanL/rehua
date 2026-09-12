import {
  type StrictRJSFSchema,
  type RJSFSchema,
  type FormContextType,
  getTemplate,
  getUiOptions,
  type ArrayFieldItemTemplateProps,
} from '@rjsf/utils';
import { useMemo, type JSX } from 'react';

export default function ArrayFieldItemTemplate<
  T = unknown,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = FormContextType,
>({
  children,
  buttonsProps,
  hasToolbar,
  uiSchema,
  className,
  registry,
}: ArrayFieldItemTemplateProps<T, S, F>): JSX.Element {
  const uiOptions = useMemo(() => getUiOptions<T, S, F>(uiSchema), [uiSchema]);

  const ArrayFieldItemButtonsTemplate = useMemo(
    () =>
      getTemplate<'ArrayFieldItemButtonsTemplate', T, S, F>(
        'ArrayFieldItemButtonsTemplate',
        registry,
        uiOptions,
      ),
    [registry, uiOptions],
  );

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
