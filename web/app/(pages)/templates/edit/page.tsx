'use client';

import useFindOneTemplateOptions from '../useFindOneTemplateOptions';
import Surface from '@/app/components/common/Surface';
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

  const options = useFindOneTemplateOptions(id);
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
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        <div className="bg-rehua-white">
          <EditFormPage
            title="Modify Template"

            defaultTemplateName={data.templateName}
            defaultTemplateType={typia.assert<TemplateDocumentType[]>(
              data.templateType,
            )}
            defaultSchema={data.schema}
            defaultUiSchema={data.uiSchema}
          />
        </div>
      </Surface>
    </div>
  );
}
