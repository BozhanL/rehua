'use client';

import useFindOneTemplateOptions from './useFindOneTemplateOptions';
import FormTemplate from '@/app/components/form';
import { useQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import { useState, type JSX } from 'react';
import typia from 'typia';

export default function Home(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  typia.assertGuard<string>(id);

  const [formData, setFormData] = useState<unknown>(undefined);

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
