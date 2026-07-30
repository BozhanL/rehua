'use client';

import ContentButton from '@/app/components/ContentButton';
import FormTemplate, {
  ObjectFieldTemplate,
  type ObjectFieldTemplateContext,
} from '@/app/components/form';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import { create as createTemplateSDK } from '@rehua/sdk/functional/templates';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';

const defaultSchema: RJSFSchema = {
  type: 'object',
  properties: {},
};

const defaultUiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    norender: true,
  },
};

async function createTemplate({
  host,
  schema,
  uiSchema,
}: {
  host: string;
  schema: RJSFSchema;
  uiSchema: UiSchema;
}): Promise<createTemplateSDK.Output> {
  return createTemplateSDK(
    { host, simulate: isTesting },
    {
      schema,
      uiSchema,
    },
  );
}

export default function Home(): JSX.Element {
  const [formData, setFormData] = useState<unknown>(undefined);
  const [schema, setSchema] = useState<RJSFSchema>(defaultSchema);
  const [uiSchema, setUiSchema] = useState<UiSchema>(defaultUiSchema);

  const router = useRouter();

  const host = useContext(APIUrlContext);

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
  });

  return (
    <>
      <h1>Create form example</h1>

      <FormTemplate<
        unknown,
        RJSFSchema,
        { objectFieldTemplate: ObjectFieldTemplateContext }
      >
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={(e) => {
          setFormData(e.formData);
        }}
        templates={{ ObjectFieldTemplate }}
        formContext={{
          objectFieldTemplate: {
            templates: uiSchema['ui:order'] ?? [],
            setSchema,
            setUiSchema,
          },
        }}
      />

      <ContentButton
        type="button"
        text1="Save"
        text2="Template"
        iconProps={{ name: 'save' }}
        foregroundColor="text-rehua-white"
        backgroundColor="bg-rehua-green"
        textAlign="right"
        onClick={() => {
          createTemplateMutation.mutate(
            { host, schema, uiSchema },
            {
              onSuccess: (resp) => {
                const searchParams = new URLSearchParams();
                searchParams.append('id', resp._id);
                router.push(`/templates?${searchParams.toString()}`);
              },
            },
          );
        }}
      />
    </>
  );
}
