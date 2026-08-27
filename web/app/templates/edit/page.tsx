'use client';

import { useTemplateOptions } from '../page';
import EditFormPage from '@/app/components/form/EditFormPage';
import type { TemplateDocumentType } from '@/app/utils/types';
import { useQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import typia from 'typia';

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
