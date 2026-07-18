'use client';

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
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext, type JSX } from 'react';

const schema: RJSFSchema = {
  type: 'object',
  properties: {
    'First name': {
      type: 'string',
      default: 'Chuck',
    },
    lastName: {
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
const uiSchema: UiSchema = {
  'First name': {
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
      <button
        type="button"
        onClick={() => {
          createTemplateMutation.mutate(
            { host },
            {
              onSuccess: (resp) => {
                const searchParams = new URLSearchParams();
                searchParams.append('id', resp._id);
                router.push(`/templates?${searchParams.toString()}`);
              },
            },
          );
        }}
      >
        Create Template
      </button>
    </>
  );
}
