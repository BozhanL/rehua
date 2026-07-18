'use client';

import ContentButton from '@/app/components/ContentButton';
import FormTemplate from '@/app/components/form/FormTemplate';
import ObjectFieldTemplate, {
  type ObjectFieldTemplateContext,
} from '@/app/components/form/ObjectFieldTemplate';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import {
  findAll as findAllTemplateSDK,
  create as createTemplateSDK,
} from '@rehua/sdk/functional/templates';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, useState, type JSX } from 'react';

const defaultSchema: RJSFSchema = {
  type: 'object',
  properties: {
    'First name': {
      type: 'string',
    },
    'Last name': {
      type: 'string',
    },
    age: {
      type: 'integer',
    },
    bio: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    telephone: {
      type: 'string',
    },
  },
};

const defaultUiSchema: UiSchema = {
  'ui:label': true,
  'ui:order': [
    'First name',
    'Last name',
    'age',
    'bio',
    'password',
    'telephone',
  ],
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useTemplateOptions() {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['templates', host],
    queryFn: async () =>
      findAllTemplateSDK({
        host: host,
        simulate: isTesting,
      }),
  });
}

export default function Home(): JSX.Element {
  const [formData, setFormData] = useState<unknown>(undefined);
  const [schema, setSchema] = useState<RJSFSchema>(defaultSchema);
  const [uiSchema, setUiSchema] = useState<UiSchema>(defaultUiSchema);

  const router = useRouter();

  const host = useContext(APIUrlContext);
  const queryClient = useQueryClient();

  const options = useTemplateOptions();

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: options.queryKey,
      }),
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
          objectFieldTemplate: { schema, uiSchema, setSchema, setUiSchema },
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
