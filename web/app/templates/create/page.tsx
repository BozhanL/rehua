'use client';

import FormTemplate from '@/app/components/FormTemplate';
import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import {
  findAll as findAllTemplate,
  create,
} from '@rehua/sdk/functional/templates';
import type { RJSFSchema, UiSchema } from '@rjsf/utils';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useContext, useState, type JSX } from 'react';

const schema: RJSFSchema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    age: {
      type: 'integer',
      title: 'Age',
    },
    bio: {
      type: 'string',
      title: 'Bio',
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3,
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
  },
};
const uiSchema: UiSchema = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': '',
    'ui:placeholder':
      'ui:emptyValue causes this field to always be valid despite being required',
    'ui:autocomplete': 'family-name',
    'ui:enableMarkdownInDescription': true,
    'ui:description':
      'Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/).',
  },
  lastName: {
    'ui:autocomplete': 'given-name',
    'ui:enableMarkdownInDescription': true,
    'ui:description':
      'Make things **bold** or *italic*. Embed snippets of `code`. <small>NOTE: Unsafe HTML, not rendered</small> ',
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earth year)',
  },
  bio: {
    'ui:widget': 'textarea',
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!',
  },
  telephone: {
    'ui:options': {
      inputType: 'tel',
    },
  },

  'ui:submitButtonOptions': {
    norender: true,
  },
};

async function createTemplate({
  host,
}: {
  host: string;
}): Promise<create.Output> {
  return create(
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
      findAllTemplate({
        host: host,
        simulate: isTesting,
      }),
  });
}

export default function Home(): JSX.Element {
  const [formData, setFormData] = useState<unknown>(undefined);

  const host = useContext(APIUrlContext);
  const queryClient = useQueryClient();

  const options = useTemplateOptions();
  const findTemplate = useQuery(options);

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: options.queryKey,
      }),
  });

  if (!findTemplate.isSuccess || !findTemplate.data[0]) {
    return (
      <>
        <h1>Loading...</h1>
        <button
          onClick={() => {
            createTemplateMutation.mutate({ host });
          }}
        >
          Create Template
        </button>
      </>
    );
  }

  const data = findTemplate.data[0];

  return (
    <>
      <h1>Form example</h1>

      <FormTemplate
        schema={data.schema}
        uiSchema={data.uiSchema as UiSchema}
        formData={formData}
        onChange={(e) => {
          setFormData(e.formData);
        }}
      />
    </>
  );
}
