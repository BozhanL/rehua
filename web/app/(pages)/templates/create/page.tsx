'use client';

import Surface from '@/app/components/common/Surface';
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
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        <div className="bg-rehua-white">
          <EditFormPage
            title="Make a New Template"
            defaultSchema={defaultSchema}
            defaultUiSchema={defaultUiSchema}
          />
        </div>
      </Surface>
    </div>
  );
}
