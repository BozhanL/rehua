'use client';

import EditFormPage from '@/app/components/form/EditFormPage';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import type { JSX } from 'react';

const defaultSchema: RJSFSchema = {
  type: 'object',
  properties: {},
};

const defaultUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    norender: true,
  },
};

export default function Home(): JSX.Element {
  return (
    <EditFormPage
      title="Make a New Template"
      defaultSchema={defaultSchema}
      defaultUiSchema={defaultUiSchema}
    />
  );
}
