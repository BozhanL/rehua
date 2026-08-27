'use client';

import EditFormPage from '@/app/components/form/EditFormPage';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import type { TemplateDocumentType } from '@/app/utils/types';
import { findOne as findOneTemplate } from '@rehua/sdk/functional/templates';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import typia from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useTemplateOptions(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: ['templates', host, id],
    queryFn: async ({ signal }: QueryFunctionContext) => {
      return findOneTemplate(
        {
          host: host,
          simulate: isTesting,
          options: { signal },
        },
        id,
      );
    },
  });
}

export default function Home(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  typia.assertGuard<string>(id);

  const options = useTemplateOptions(id);
  const findTemplate = useQuery(options);

  if (findTemplate.isError) {
    throw findTemplate.error;
  } else if (!findTemplate.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!findTemplate.data) {
    notFound();
  }

  const data = findTemplate.data;

  return (
    <EditFormPage
      title="Modify Template"

      defaultTemplateName={data.templateName}
      defaultTemplateType={typia.assert<TemplateDocumentType[]>(
        data.templateType,
      )}
      defaultSchema={data.schema}
      defaultUiSchema={data.uiSchema}
    />
  );
}
