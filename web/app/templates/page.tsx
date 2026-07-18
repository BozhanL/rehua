'use client';

import FormTemplate from '@/app/components/FormTemplate';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import { findOne as findOneTemplate } from '@rehua/sdk/functional/templates';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';
import typia from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useTemplateOptions(id: string) {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['templates', host, id],
    queryFn: async () => {
      return findOneTemplate(
        {
          host: host,
          simulate: isTesting,
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

  const [formData, setFormData] = useState<unknown>(undefined);

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
    <>
      <h1>Form example</h1>

      <FormTemplate
        schema={data.schema}
        uiSchema={data.uiSchema}
        formData={formData}
        onChange={(e) => {
          setFormData(e.formData);
        }}
      />
    </>
  );
}
